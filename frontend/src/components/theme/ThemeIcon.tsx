import { THEME } from "../../config/Enum";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useTheme } from "../../context/ThemeProvider";

const ThemeIcon = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <div onClick={toggleTheme} className="cursor-pointer">
        {theme === THEME.DARK ? (
          <MdDarkMode className="w-8 h-8" />
        ) : (
          <MdLightMode className="w-8 h-8" />
        )}
      </div>
    </>
  );
};

export default ThemeIcon;
