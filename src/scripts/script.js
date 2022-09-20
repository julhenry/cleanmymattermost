let url, token, userId, teamId, channelId;
let currentTargetId = "step-1";

const LocalStorageKeys = {
    savedURL: 'cleanMyMattermost-savedURL',
    savedToken: 'cleanMyMattermost-savedToken',
};

const SessionStorageKeys = {
    posts: 'cleanMyMattermost-posts',
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
    if(url) $("#url").val(url);
    const token = localStorage.getItem(LocalStorageKeys.savedToken);
    if(token) $("#token").val(token);
})()

function nextStep(target){
    const data = [...$(`#${currentTargetId} input`), ...$(`#${currentTargetId} select`)].reduce(((previousValue, currentValue) => {
        return {
            ...previousValue,
            [$(currentValue).attr('id')]: $(currentValue).val()
        }
    }), {});

    const targetElement = $(`#${currentTargetId}`);
    const currentText = targetElement.find('button').html();
    targetElement.find('button').html('<div class="spinner-border" role="status"></div>');


    handlers[currentTargetId](data)
        .then(() => {
            setTimeout(() => {
                targetElement.find('button').html(currentText);
                targetElement.fadeOut(500, () => {
                    $(`#${target}`).fadeIn(1000, () => {
                        currentTargetId = target;
                    });
                });
            }, 500);
        })
        .catch((error) => {
            console.log(error);
            setTimeout(() => {
                $(`#${currentTargetId}`).find('button').html(currentText);
            }, 500);
        })

}

const handlers = {
    'step-1': ({url: mattermostUrl}) => {
      return new Promise(resolve => {
          url = mattermostUrl + (mattermostUrl.endsWith('/') ? '' : '/');
          localStorage.setItem(LocalStorageKeys.savedURL, url);
          resolve();
      })
    },
    'step-2': ({token: tkn}) => {
        token = tkn;
        localStorage.setItem(LocalStorageKeys.savedToken, token);
        return request(url + 'users/me', 'GET')
            .then((response) => {
                userId = response.id
                return request(`${url}users/${userId}/teams`, 'GET')
                    .then((response) => {
                        response.forEach(teamData => {
                            $("#teamSelect").append(`<option value="${teamData.id}">${teamData['display_name']}</option>`);
                        })
                        return true;
                    })
            })
    },
    'step-3': ({teamSelect}) => {
        teamId = teamSelect;
        return request(`${url}users/${userId}/teams/${teamId}/channels`, 'GET')
            .then((response) => {
                response.forEach(channelData => {
                    $("#channelSelect").append(`<option id="${channelData.id}" value="${channelData.id}">${channelData.name}</option>`);
                    if(channelData.name.indexOf('__') > -1){
                        const searchUserId = channelData.name.split('__').find(id => id !== userId);
                        if(searchUserId){
                            request(`${url}users/${searchUserId}`, 'GET')
                                .then(userData => {
                                    $(`#${channelData.id}`).html(`${userData['first_name']}  ${userData['last_name']}`)
                                })
                        }
                    }else{
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
    'step-4': ({channelSelect}) => {
        return new Promise((resolve) => {
            channelId = channelSelect;
            resolve();
        });
    },
    'step-5': ({message}) => {
      return new Promise((async (resolve) => {
          function getPosts(numberPage = 0) {
              return request(`${url}channels/${channelId}/posts?page=${numberPage}&per_page=200`, 'GET')
                  .then((response) => {
                      const posts = Object.values(response['posts']).filter(p => p['user_id'] === userId);
                      let currentPosts = JSON.parse(sessionStorage.getItem(SessionStorageKeys.posts)) || [];
                      const newPosts = currentPosts.concat(posts);
                      sessionStorage.setItem(SessionStorageKeys.posts, JSON.stringify(newPosts));
                      if (posts.length > 0) {
                          return getPosts(numberPage + 1);
                      } else {
                          return true;
                      }
                  })
          }

          function removePosts(){
              let posts = JSON.parse(sessionStorage.getItem(SessionStorageKeys.posts));

              if(!posts.length){
                  return true;
              }

              const post = posts[0];
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
                      posts.push(post);
                      sessionStorage.setItem(SessionStorageKeys.posts, JSON.stringify(posts));
                      return removePosts()
                  })
          }

          await getPosts(0);
          await removePosts();
          resolve();
      }));
    },
}

function request(url, type, data){
    return new Promise(((resolve, reject) => {
        // noinspection JSUnusedGlobalSymbols
        $.ajax({
            url,
            type,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'bearer ' + token);
            },
            data: type === 'GET' ? data : JSON.stringify(data),
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            success: (data) => {
                resolve(data)
            },
            error: reject,
        });
    }))
}
