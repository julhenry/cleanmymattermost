import AsyncStorage from '@react-native-community/async-storage';

enum LocalStorageKeys{
  URL = 'cleanMyMattermost-savedURL',
  Token = 'cleanMyMattermost-savedToken'
}

export class LocalStorageService{

  private static instance: LocalStorageService;

  static getInstance(){
    if(!LocalStorageService.instance){
      LocalStorageService.instance = new LocalStorageService();
    }

    return LocalStorageService.instance;
  }

  getURL = async (): Promise<string | null> => {
    return AsyncStorage.getItem(LocalStorageKeys.URL);
  };

  setURL = async (url: string) => {
    return AsyncStorage.setItem(LocalStorageKeys.URL, url)
  }

}
