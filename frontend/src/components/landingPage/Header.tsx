import ThemeIcon from "../theme/ThemeIcon";
import Logo from "../../assets/images/logo3.png";
import Logo1 from "../../assets/images/logo.png";
import { useTheme } from "../../context/ThemeProvider";
import { THEME } from "../../config/Enum";
import LoginButton from "../buttons/LoginButton";
import { IoMenuOutline } from "react-icons/io5";
import { useState } from "react";
import HamburgerMenu from "./HamburgerMenu";

const Header = () => {
  const { theme } = useTheme();
  const [isHamburgerMenuVisible, setIsHamburgerMenuVisible] = useState<boolean>(
    false
  );

  const changeHamburgetMenuVisibility = async (visibilityValue: boolean) => {
    setIsHamburgerMenuVisible(visibilityValue);
  };

  return (
    <header
      className={`flex justify-between items-center w-full h-20 sticky top-0 px-5 text-txt bg-bkg z-10`}
    >
      <nav className={`flex items-center`}>
        <img
          src={theme === THEME.LIGHT ? Logo1 : Logo}
          alt="Main page logos"
          className={`h-8`}
        ></img>
        <ul className={`hidden lg:flex gap-10 px-10`}>
          <li className={`relative cursor-pointer`}>
            <p>Strona główna</p>
          </li>
          <li className={`relative cursor-pointer`}>
            <p>Cennik</p>
          </li>
          <li className={`relative cursor-pointer`}>
            <p>Dlaczego SZA?</p>
          </li>
          <li className={`relative cursor-pointer`}>
            <p>Kontakt</p>
          </li>
        </ul>
      </nav>
      <section className={`flex items-center gap-5`}>
        <ThemeIcon />
        <span className={`hidden lg:block`}>
          <LoginButton />
        </span>
        <IoMenuOutline
          className={`lg:hidden w-10 h-10 cursor-pointer`}
          onClick={() => changeHamburgetMenuVisibility(true)}
        />
        <HamburgerMenu
          isHamburgerMenuVisible={isHamburgerMenuVisible}
          changeHamburgerMenuVisibility={changeHamburgetMenuVisibility}
        />
      </section>
    </header>
  );
};

export default Header;
