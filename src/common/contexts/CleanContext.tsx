import React, {createContext, useState, useContext, useEffect} from 'react';

import {CleanData, CleanService} from '../services/CleanService';
import {LocalStorageService} from "../services/LocalStorageService";

type CleanContextData = {
  cleanData?: CleanData;
  loading: boolean;
  setURL(url: string): void;
  getMe(): void;
  getMyTeams(): void;
  getMyChannels(): void;
  getMyPosts(): void;
  removePosts(): void;
  getAllPosts(): void;
};

const CleanContext = createContext<CleanContextData>({} as CleanContextData);

interface Props {
  children: React.ReactNode;
}

const CleanProvider: React.FC<Props> = ({children}) => {
  const [cleanData, setCleanData] = useState<CleanData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData(): Promise<void> {
    try {
      const savedURL = await LocalStorageService.getInstance().getURL();
      const savedToken = await LocalStorageService.getInstance().getToken();
      setCleanData({
        ...cleanData,
        ...(savedURL ? {url: savedURL} : {}),
        ...(savedToken ? {user: {token: savedToken}} : {}),
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  const setURL = async (url: string) => {
    try {
      setLoading(true);
      await LocalStorageService.getInstance().setURL(url);
      setCleanData({
        ...cleanData,
        url: url,
      });
      setLoading(false);
    } catch (_) {
    }
  };

  const getMe = async () => {
    try {
      setLoading(true);
      const userData = await CleanService.getInstance().getMe('https://mattermost.afone.com/api/v4/', 'jyxh9w31yinzzcmmf4in9i5adw');
      await LocalStorageService.getInstance().setToken(userData.token);
      setCleanData({
        ...cleanData,
        user: userData,
      });
      setLoading(false);
    }catch (_){}
  };

  const getMyTeams = async () => {
    try {
      setLoading(true);
      const teams = await CleanService.getInstance().getMyTeams(cleanData.user?.userId ?? '');
      setCleanData({
        ...cleanData,
        teams,
      });
    }catch (_){}
  };

  const getMyChannels = async () => {
    try {
      setLoading(true);
      const channels = await CleanService.getInstance().getMyChannels(cleanData.user?.userId ?? '', 'j3oaws8kppds3no45cr54jqf5r');
      setCleanData({
        ...cleanData,
        channels,
      });
    }catch (_){}
  };

  const getMyPosts = async () => {
    try {
      setLoading(true);
      const posts = await CleanService.getInstance().getMyPosts("g3ejc9dhfj8ejxdp6egpex54hw", cleanData.user?.userId ?? '');
      setCleanData({
        ...cleanData,
        posts,
      });
    }catch (_){}
  };

  const getAllPosts = async () => {
    try {
      setLoading(true);
      const posts = await CleanService.getInstance().getAllPosts("g3ejc9dhfj8ejxdp6egpex54hw");
      setCleanData({
        ...cleanData,
        posts,
      });
    }catch (_){}
  };

  const removePosts = async () => {
    try {
      setLoading(true);
      await CleanService.getInstance().removePosts(cleanData?.posts ?? [], 'Edition depuis C2M REACT', true);
    }catch (_){}
  };

  return (
    <CleanContext.Provider value={{cleanData, loading, setURL, getMe, getMyTeams, getMyChannels, getMyPosts, removePosts, getAllPosts}}>
      {children}
    </CleanContext.Provider>
  );
};

function useClean(): CleanContextData {
  const context = useContext(CleanContext);

  if (!context) {
    throw new Error('useClean must be used within an CleanProvider');
  }

  return context;
}

export {CleanContext, CleanProvider, useClean};
