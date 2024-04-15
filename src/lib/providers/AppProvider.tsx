import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../models';

type AppGlobalState = {
  theme: 'light' | 'dark';
  language: 'en' | 'tr';
  currentUser?: User;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'en' | 'tr') => void;
  setCurrentUser: (user: User) => void;
};

const initialState: AppGlobalState = {
  theme: 'light',
  language: 'en',
  currentUser: undefined,
  setTheme: () => {},
  setLanguage: () => {},
  setCurrentUser: () => {}
};

const AppContext = createContext<[AppGlobalState, (state: AppGlobalState) => void]>([initialState, () => {}]);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppGlobalState>(initialState);

  return (
      <AppContext.Provider value={[state, setState]}>
        {children}
      </AppContext.Provider>
  );
};