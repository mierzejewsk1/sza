import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { THEME } from "../config/Enum";

interface ThemeContextProps {
  theme: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState("");

  const changeThemeValue = (value: string): void => {
    document.documentElement.setAttribute("data-theme", value);
  };

  const toggleTheme = (): void => {
    if (theme === THEME.DARK) {
      localStorage.setItem("theme", THEME.LIGHT);
      setTheme(THEME.LIGHT);
    }
    if (theme === THEME.LIGHT) {
      localStorage.setItem("theme", THEME.DARK);
      setTheme(THEME.DARK);
    }
  };

  useEffect(() => {
    let themeValue = localStorage.getItem("theme");
    let defaultTheme = document.documentElement.getAttribute("data-theme");

    if (themeValue) {
      setTheme(themeValue);
      changeThemeValue(themeValue);
    } else {
      if (defaultTheme !== null) {
        localStorage.setItem("theme", defaultTheme);
        changeThemeValue(themeValue);
        setTheme(themeValue);
      }
    }
  }, [theme]);

  const contextValue: ThemeContextProps = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
