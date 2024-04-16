import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "../models/User";

type AppGlobalState = {
  theme: "light" | "dark";
  language: "en" | "tr";
  currentUser?: User;
};

interface AppContextType extends AppGlobalState {
  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (language: "en" | "tr") => void;
  setCurrentUser: (user?: User) => void;
}

const initialState: AppGlobalState = {
  theme: "light",
  language: "en",
  currentUser: undefined,
};

const AppContext = createContext<AppContextType>({
  ...initialState,
  setTheme: () => {},
  setLanguage: () => {},
  setCurrentUser: () => {},
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AppGlobalState>(() => {
    const storedState = localStorage.getItem("appState");
    return storedState
      ? JSON.parse(storedState)
      : { theme: "light", language: "en", currentUser: undefined };
  });

  useEffect(() => {
    localStorage.setItem("appState", JSON.stringify(state));
  }, [state]);

  const setTheme = (theme: "light" | "dark") => {
    setState((prevState) => ({ ...prevState, theme }));
  };

  const setLanguage = (language: "en" | "tr") => {
    setState((prevState) => ({ ...prevState, language }));
  };

  const setCurrentUser = (user?: User) => {
    setState((prevState) => ({ ...prevState, currentUser: user }));
  };

  return (
    <AppContext.Provider
      value={{ ...state, setTheme, setLanguage, setCurrentUser }}>
      {children}
    </AppContext.Provider>
  );
};
