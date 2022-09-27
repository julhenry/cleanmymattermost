import axios from "axios";

export type UserData = {
  token: string
  userId: string
}

export type CleanData = {
  user?: UserData
  url?: string
};

export class CleanService {
  private static instance: CleanService;

  static getInstance(){
    if(!CleanService.instance){
      CleanService.instance = new CleanService();
    }

    return CleanService.instance;
  }

  signIn = (url: string, token: string): Promise<UserData> => {
    return axios.get(`${url}users/me`)
      .then((response) => {
        return {
          token,
          userId: response.data.userId
        }
      });
  };

}
