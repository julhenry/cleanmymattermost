let url, token, userId, teamId, channelId, isNextStepEnable;
let currentTargetId = "step-1";
isNextStepEnable = true;

const LocalStorageKeys = {
  savedURL: 'cleanMyMattermost-savedURL',
  savedToken: 'cleanMyMattermost-savedToken',
};

const SessionStorageKeys = {
  posts: 'cleanMyMattermost-posts',
  editCounter: 'cleanMyMattermost-editCounter'
};

(function () {
  'use strict'
  const forms = document.querySelectorAll('form')
  Array.from(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault()
        event.stopPropagation()
        if (form.checkValidity()) {
          nextStep($(form).attr('target'))
        }

        form.classList.add('was-validated')
      }, false)
    })

  const url = localStorage.getItem(LocalStorageKeys.savedURL);
  if (url) $("#url").val(url);
  const token = localStorage.getItem(LocalStorageKeys.savedToken);
  if (token) $("#token").val(token);
  sessionStorage.setItem(SessionStorageKeys.editCounter, '0');
})()

function setStep(target) {
  if (!isNextStepEnable) {
    return;
  }

  isNextStepEnable = false;

  $(`#${currentTargetId}`).fadeOut(500, () => {
    $(`#${target}`).fadeIn(500, () => {
      currentTargetId = target;
      isNextStepEnable = true;
    });
  })
}

function nextStep(target) {
  if (!isNextStepEnable) {
    return;
  }

  isNextStepEnable = false;

  const data = [...$(`#${currentTargetId} input`), ...$(`#${currentTargetId} select`)].reduce(((previousValue, currentValue) => {
    return {
      ...previousValue,
      [$(currentValue).attr('id')]: $(currentValue).val()
    }
  }), {});

  const targetElement = $(`#${currentTargetId}`);
  const currentText = targetElement.find('.next-step-button').html();
  targetElement.find('.next-step-button').html('<div class="spinner-border" role="status"></div>');


  handlers[currentTargetId](data)
    .then(() => {
      setTimeout(() => {
        targetElement.find('.next-step-button').html(currentText);
        targetElement.fadeOut(500, () => {
          $(`#${target}`).fadeIn(500, () => {
            currentTargetId = target;
            isNextStepEnable = true;
          });
        });
      }, 500);
    })
    .catch((error) => {
      console.log(error);
      setTimeout(() => {
        $(`#${currentTargetId}`).find('.next-step-button').html(currentText);
        isNextStepEnable = true;
      }, 500);
    })

}

const handlers = {
  'step-1': ({ url: mattermostUrl }) => {
    return new Promise(resolve => {
      url = mattermostUrl + (mattermostUrl.endsWith('/') ? '' : '/');
      localStorage.setItem(LocalStorageKeys.savedURL, url);
      resolve();
    })
  },
  'step-2': ({ token: tkn }) => {
    token = tkn;
    localStorage.setItem(LocalStorageKeys.savedToken, token);
    return request(`${url}users/me`, 'GET')
      .then((response) => {
        userId = response.id
        return request(`${url}users/${userId}/teams`, 'GET')
          .then((response) => {
            $("#teamSelect").html('<option selected disabled value="">Select a team</option>');
            response.forEach(teamData => {
              $("#teamSelect").append(`<option value="${teamData.id}">${teamData['display_name']}</option>`);
            })
            return true;
          })
      })
  },
  'step-3': ({ teamSelect }) => {
    teamId = teamSelect;
    return request(`${url}users/${userId}/teams/${teamId}/channels`, 'GET')
      .then((response) => {
        $("#channelSelect").html('<option selected disabled value="">Select a channel</option>');
        response.forEach(channelData => {
          $("#channelSelect").append(`<option id="${channelData.id}" value="${channelData.id}">${channelData.name}</option>`);
          if (channelData.name.indexOf('__') > -1) {
            const searchUserId = channelData.name.split('__').find(id => id !== userId);
            if (searchUserId) {
              request(`${url}users/${searchUserId}`, 'GET')
                .then(userData => {
                  const username = userData['first_name']?.length ? `${userData['first_name']}  ${userData['last_name']}` : userData.username;
                  $(`#${channelData.id}`).html(username);
                })
            }
          } else {
            request(`${url}channels/${channelData.id}`, 'GET')
              .then((speChannelData) => {
                const channelTitleName = speChannelData?.['display_name']?.length ? speChannelData?.['display_name'] : channelData.name;
                const channelDescription = speChannelData?.['purpose']?.length ? `(${speChannelData?.['purpose']})` : speChannelData?.header?.length ? `(${speChannelData?.header})` : '';
                $(`#${channelData.id}`).html(`${channelTitleName} ${channelDescription}`);
              })
          }
        })
      })
  },
  'step-4': ({ channelSelect }) => {
    return new Promise((resolve) => {
      channelId = channelSelect;
      resolve();
    });
  },
  'step-5': ({ message }) => {
    return new Promise((async (resolve) => {
      function getPosts(numberPage = 0) {
        return request(`${url}channels/${channelId}/posts?page=${numberPage}&per_page=200`, 'GET')
          .then((response) => {
            const posts = Object.values(response['posts']).filter(p => p['user_id'] === userId);
            let currentPosts = JSON.parse(sessionStorage.getItem(SessionStorageKeys.posts)) || [];
            const newPosts = currentPosts.concat(posts);
            sessionStorage.setItem(SessionStorageKeys.posts, JSON.stringify(newPosts));
            return posts.length > 0
          })
      }

      function removePosts() {
        let posts = JSON.parse(sessionStorage.getItem(SessionStorageKeys.posts));

        if (!posts.length) {
          return true;
        }

        const post = posts[0];
        $('#in-progress-label').html(`Updating : ${post.message}`);
        const editNumber = (parseInt(sessionStorage.getItem(SessionStorageKeys.editCounter)) || 0) + 1;
        $('#in-progress-post-count').html(`${editNumber} messages updated`);
        sessionStorage.setItem(SessionStorageKeys.editCounter, editNumber);
        return request(`${url}posts/${post.id}`, 'PUT', {
          ...post,
          message: message
        })
          .then(() => {
            posts = posts.filter(p => p.id !== post.id);
            sessionStorage.setItem(SessionStorageKeys.posts, JSON.stringify(posts));
            return removePosts()
          })
          .catch(() => {
            posts = posts.filter(p => p.id !== post.id);
            sessionStorage.setItem(SessionStorageKeys.posts, JSON.stringify(posts));
            return removePosts()
          })
      }

      let pageNumber = 0
      while (await getPosts(pageNumber)) {
        await removePosts();
        pageNumber++;
      }

      resolve();
    }));
  },
}

function request(url, type, data) {
  return new Promise(((resolve, reject) => {
    // noinspection JSUnusedGlobalSymbols
    $.ajax({
      url,
      type,
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'bearer ' + token);
      },
      data: type === 'GET' ? data : JSON.stringify(data),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: (data) => {
        resolve(data)
      },
      error: reject,
    });
  }))
}
