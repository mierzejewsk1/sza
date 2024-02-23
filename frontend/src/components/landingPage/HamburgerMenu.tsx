import { IoMdClose } from "react-icons/io";

type HamburgerMenuProps = {
  isHamburgerMenuVisible: boolean;
  changeHamburgerMenuVisibility: (visibilityValue: boolean) => void;
};

const HamburgerMenu = ({
  isHamburgerMenuVisible,
  changeHamburgerMenuVisibility,
}: HamburgerMenuProps) => {
  return (
    <div
      className={`${
        isHamburgerMenuVisible ? "flex" : "hidden"
      } fixed top-0 left-0 bg-bkg flex-row justify-center items-center w-full h-full`}
    >
      <ul className={`flex flex-col gap-10 px-10`}>
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
      <IoMdClose
        className={`w-10 h-10 cursor-pointer`}
        onClick={() => changeHamburgerMenuVisibility(false)}
      />
    </div>
  );
};

export default HamburgerMenu;
