import { createContext, useContext, useState, ReactNode } from 'react';
import { BoxCcgAuth, BoxClient } from 'box-typescript-sdk-gen';
import { BoxUser } from './types';

export type SessionType = {
    loggedIn: boolean;
    boxUser: BoxUser | undefined;
    jwtToken: string | undefined;
    boxClient: BoxClient | undefined;
}

export interface AppContextType {
  session: SessionType;
  contextLogin: (session: SessionType) => void;
  contextLogout: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  let [session, setSession] = useState<SessionType>({
    loggedIn: false,
    boxUser: undefined,
    jwtToken: undefined,
    boxClient: undefined
  });

  function contextLogin(session: SessionType) {
    setSession(session);
  }
  function contextLogout() {
    setSession({
      loggedIn: false,
      boxUser: undefined,
      jwtToken: undefined,
      boxClient: undefined
    });
  }

  return (
    <AppContext.Provider value={{ session, contextLogin, contextLogout}}>
      {children}
    </AppContext.Provider>
  );
}; 

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  return context;
};