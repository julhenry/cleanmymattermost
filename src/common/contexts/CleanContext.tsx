import React, {createContext, useState, useContext, useEffect} from 'react';

import {CleanData, CleanService} from '../services/CleanService';
import {LocalStorageService} from "../services/LocalStorageService";

type CleanContextData = {
  cleanData?: CleanData;
  loading: boolean;
  setURL(url: string): void;
  signIn(): Promise<void>;
};

const CleanContext = createContext<CleanContextData>({} as CleanContextData);

interface Props {
  children: React.ReactNode;
}

const CleanProvider: React.FC<Props> = ({children}) => {
  const [cleanData, setCleanData] = useState<CleanData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData(): Promise<void> {
    try {
      const savedURL = await LocalStorageService.getInstance().getURL();
      if (savedURL) {
        setCleanData({
          ...cleanData,
          url: savedURL,
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  const setURL = (url: string) => {
    setLoading(true);
    setCleanData({
      ...cleanData,
      url: url,
    });
    setLoading(false);
  };

  const signIn = async () => {
    setLoading(true);
    const _authData = await CleanService.getInstance().signIn('https://mattermost.afone.com/api/v4/', 'mytoken');
    setCleanData({
      ...cleanData,
      user: _authData,
    });
    setLoading(false);
  };

  return (
    <CleanContext.Provider value={{cleanData, loading, setURL, signIn}}>
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
