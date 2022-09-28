import axios, {AxiosInstance} from "axios";

export type UserData = {
  token: string
  userId?: string
}

export type CleanData = {
  user?: UserData
  url?: string
  teams?: any[]
  channels?: any[]
  posts?: any[]
};

export class CleanService {
  private static instance: CleanService;
  private axiosInstance: AxiosInstance | undefined = undefined;

  static getInstance(){
    if(!CleanService.instance){
      CleanService.instance = new CleanService();
    }

    return CleanService.instance;
  }

  private initiateAxiosInstance = (url: string, token: string) => {
    if(!this.axiosInstance){
      this.axiosInstance = axios.create({
        baseURL: url,
        timeout: 50000,
        headers: {'Authorization': 'Bearer '+token}
      })
    }
  };

  getMe = (url: string, token: string): Promise<UserData> => {
    this.initiateAxiosInstance(url, token);

    return this.axiosInstance!.get(`users/me`)
      .then((response) => {
        return {
          token,
          userId: response.data.id
        }
      });
  };

  getMyTeams = (userId: string) => {
    return this.axiosInstance!.get(`users/${userId}/teams`)
      .then((response) => {
        return response.data
      })
  };

  getMyChannels = (userId: string, teamId: string) => {
    return this.axiosInstance!.get(`users/${userId}/teams/${teamId}/channels`)
      .then((response) => {
        let channelPromises: any[] = [];
        response.data.forEach((channelData:any) => {
          if (channelData.name.indexOf('__') > -1) {
            const searchUserId = channelData.name.split('__').find((id: string) => id !== userId);
            if(searchUserId){
              channelPromises.push(this.axiosInstance!.get(`users/${searchUserId}`)
                .then(userData => {
                  const username = userData.data['first_name']?.length ? `${userData.data['first_name']}  ${userData.data['last_name']}` : userData.data.username;
                  return {
                    ...channelData,
                    nameToDisplay: username,
                  }
                }))
            }
          }else{
            channelPromises.push(this.axiosInstance!.get(`channels/${channelData.id}`)
              .then((speChannelData) => {
                const channelTitleName = speChannelData?.data?.['display_name']?.length ? speChannelData?.data?.['display_name'] : channelData.name;
                const channelDescription = speChannelData?.data?.['purpose']?.length ? `(${speChannelData?.data?.['purpose']})` : speChannelData?.data?.header?.length ? `(${speChannelData?.data.header})` : '';
                return {
                  ...channelData,
                  nameToDisplay: `${channelTitleName} ${channelDescription}`,
                }
              }))
          }
        });

        return Promise.all(channelPromises).then((channels) => {
          return channels.sort(function(channelA, channelB){
            if(channelA.nameToDisplay < channelB.nameToDisplay) { return -1; }
            if(channelA.nameToDisplay > channelB.nameToDisplay) { return 1; }
            return 0;
          })
        });
    })
  };

  getMyPosts = async (channelId: string, userId: string) => {
    const getPosts = (numberPage = 0) => {
      return this.axiosInstance!.get(`channels/${channelId}/posts?page=${numberPage}&per_page=200`)
        .then((response) => {
          return Object.values(response.data?.posts ?? {});
        })
    };

    let pageNumber = 0;
    let posts;
    let totalPosts: any[] = [];
    do{
      posts = await getPosts(pageNumber);
      totalPosts = totalPosts.concat(posts);
      pageNumber++;
    }while (posts.length > 0);

    return totalPosts.filter(post => (post as unknown as {user_id: string}).user_id === userId);
  };

  getAllPosts = async (channelId: string) => {
    const getPosts = (numberPage = 0) => {
      return this.axiosInstance!.get(`channels/${channelId}/posts?page=${numberPage}&per_page=200`)
        .then((response) => {
          return Object.values(response.data?.posts ?? {});
        })
    };

    let pageNumber = 0;
    let posts;
    let totalPosts: any[] = [];
    do{
      posts = await getPosts(pageNumber);
      totalPosts = totalPosts.concat(posts);
      pageNumber++;
    }while (posts.length > 0);

    return totalPosts;
  };

  removePosts = async (posts: any[], message: string, deleteAfterEditing = false) => {
    let removePromises: any[] = [];
    const removePost = (post: any) => {
      return this.axiosInstance!.put(`posts/${post.id}`, {
        ...post,
        message
      }).then(_ => {
        if(deleteAfterEditing){
          return this.axiosInstance!.delete(`posts/${post.id}`)
        }
      })
    };

    posts.forEach(post => removePromises.push(removePost(post)));

    return Promise.all(removePromises).finally(() => {
      return true
    })
  };

}
