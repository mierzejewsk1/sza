import { createContext, useReducer, useContext, ReactNode } from "react";
import { COMMON } from "../config/Enum";

interface AuthContextProps {
  user: any;
  isRestoreFinished: boolean;
  authActions: any;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "RESTORE":
      return { ...state, user: action.payload, isRestoreFinished: true };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isRestoreFinished: false,
  });

  const authActions = {
    login: (user) => {
      dispatch({ type: "LOGIN", payload: user });
      localStorage.setItem(COMMON.USER, JSON.stringify(user));
    },
    logout: () => {
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem(COMMON.USER);
    },
    restore: () => {
      const user = JSON.parse(localStorage.getItem(COMMON.USER));
      if (user) {
        dispatch({ type: "RESTORE", payload: user });
      } else {
        dispatch({ type: "RESTORE", payload: null });
      }
    },
  };

  const contextValue = {
    ...state,
    authActions,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
