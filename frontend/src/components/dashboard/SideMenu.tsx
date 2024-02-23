import { useState } from "react";
import { HOST_ADDRESS, CUSTOM_SERVER_CODE } from "../../config/Enum";
import Logo from "../../assets/images/logo3.png";
import { IoConstructOutline } from "react-icons/io5";
import { GiMagicBroom, GiBuyCard } from "react-icons/gi";
import { MdLocalLaundryService, MdOutlineBedroomChild } from "react-icons/md";
import { CgDanger } from "react-icons/cg";
import { BsInfoSquare, BsCashCoin, BsPersonVideo2 } from "react-icons/bs";
import { BiFoodMenu } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";
import SideMenuItem from "./SideMenuItem";
import AvatarSubMenu from "./AvatarSubMenu";
import { useUserData } from "../../hooks/useUserData";
import { Link } from "react-router-dom";

type SideMenuProps = {
  open: boolean;
  changeMenuState: () => void;
  pageName: string;
};

const SideMenu = ({ open, changeMenuState, pageName }: SideMenuProps) => {
  const [showAvatarSubMenu, setShowAvatarSubMenu] = useState<boolean>(false);
  const { loggedUserData, fetchMessage } = useUserData();

  return (
    <aside
      className={`h-screen duration-100 bg-second ${
        open
          ? "fixed md:relative min-w-64 border-r border-gray-700 "
          : "w-0 border-none hidden"
      }`}
      data-testid={`sidemenu`}
    >
      <section
        className={`relative bg-first ${open ? "px-2 pb-2" : "p-0 hidden"}`}
      >
        <div className="flex flex-row justify-between items-center h-14">
          <Link to="/dashboard">
            <img
              src={Logo}
              alt="Back to dashboard"
              className="w-12 cursor-pointer"
            ></img>
          </Link>
          <div className="flex gap-1">
            <div
              className={`flex items-center rounded-sm py-1 px-2 hover:bg-gray-700 cursor-pointer duration-200`}
              onClick={() => {
                changeMenuState();
                setShowAvatarSubMenu(false);
              }}
              data-testid={`hamburger icon`}
            >
              {open && <BiFoodMenu />}
            </div>
            <div
              className={`rounded-sm p-1 hover:bg-gray-700 cursor-pointer duration-200`}
              onClick={() => setShowAvatarSubMenu(!showAvatarSubMenu)}
            >
              {loggedUserData && loggedUserData.userImage !== null ? (
                <img
                  src={`${HOST_ADDRESS}/images/${
                    loggedUserData && loggedUserData.userImage
                  }`}
                  className="w-6 rounded-xl"
                ></img>
              ) : (
                <img
                  src={`${HOST_ADDRESS}/images/lack_of_profile.png`}
                  className="w-6 rounded-xl"
                ></img>
              )}
            </div>
          </div>
        </div>
        {showAvatarSubMenu && (
          <AvatarSubMenu
            userName={loggedUserData && loggedUserData.userName}
            userEmail={loggedUserData && loggedUserData.userEmail}
          />
        )}
        <nav className={`relative grid grid-cols-3 grid-rows-2 mt-2 gap-2`}>
          <div className="col-span-1 flex justify-center items-center border border-neutral-700 h-8 rounded-md bg-second hover:bg-gray-700 duration-200 cursor-pointer text-gray-400">
            <IoConstructOutline />
            <span className="absolute top-8 scale-0 rounded bg-gray-300 p-2 text-xs text-black">
              Wpisz, aby wyszukać
            </span>
          </div>
          <div className="group2 relative col-span-1 flex justify-center items-center border border-neutral-700 h-8 rounded-md bg-second hover:bg-gray-700 duration-200 cursor-pointer text-gray-400">
            <BsCashCoin />
            <span className="absolute top-8 scale-0 rounded bg-gray-300 p-2 text-xs text-black group2-hover:scale-100">
              Wpisz, aby wyszukać
            </span>
          </div>
          <div className="group3 relative col-span-1 flex justify-center items-center border border-neutral-700 h-8 rounded-md bg-second hover:bg-gray-700 duration-200 cursor-pointer text-gray-400">
            <GiMagicBroom />
            <span className="absolute top-8 scale-0 rounded bg-gray-300 p-2 text-xs text-black group3-hover:scale-100">
              Wpisz, aby wyszukać
            </span>
          </div>
          <div className="group4 relative col-span-3 flex justify-center items-center border border-neutral-700 h-8 rounded-md bg-second hover:bg-gray-700 duration-200 cursor-pointer text-gray-400">
            <IoIosSearch />
            <p className={`text-sm text-gray-200`}>Wyszukaj</p>
            <span className="absolute top-8 scale-0 rounded bg-gray-300 p-2 text-xs text-black group4-hover:scale-100">
              Wpisz, aby wyszukać
            </span>
          </div>
        </nav>
      </section>
      <nav className={`gap-1 ${open ? "" : "hidden"}`}>
        <p className={`w-full py-2 pl-5 text-sm font-normal`}>Menu boczne:</p>
        <ul className={`w-full`}>
          <SideMenuItem
            text={`Usterki`}
            icon={<IoConstructOutline />}
            link={"/faults"}
            isSelected={pageName === "Usterki" ? true : false}
          />
          <SideMenuItem
            text={`Pralnia`}
            icon={<MdLocalLaundryService />}
            link={"/laundry"}
            isSelected={pageName === "Pralnia" ? true : false}
          />
          <SideMenuItem
            text={`Uwagi`}
            icon={<CgDanger />}
            link={"/faults"}
            isSelected={pageName === "Uwagi" ? true : false}
          />
          <SideMenuItem
            text={`Ogłoszenia`}
            icon={<BsInfoSquare />}
            link={"/faults"}
            isSelected={pageName === "Ogłoszenia" ? true : false}
          />
          <SideMenuItem
            text={`Odwiedziny`}
            icon={<BsPersonVideo2 />}
            link={"/faults"}
            isSelected={pageName === "Odwiedziny" ? true : false}
          />
          <SideMenuItem
            text={`Płatności`}
            icon={<BsCashCoin />}
            link={"/faults"}
            isSelected={pageName === "Płatności" ? true : false}
          />
          <SideMenuItem
            text={`Sprzątanie`}
            icon={<GiMagicBroom />}
            link={"/faults"}
            isSelected={pageName === "Sprzątanie" ? true : false}
          />
          <SideMenuItem
            text={`Wymiany`}
            icon={<GiBuyCard />}
            link={"/faults"}
            isSelected={pageName === "Wymiany" ? true : false}
          />
          <SideMenuItem
            text={`Pokoje`}
            icon={<MdOutlineBedroomChild />}
            link={"/rooms"}
            isSelected={pageName === "Pokoje" ? true : false}
          />
        </ul>
      </nav>
      <div></div>
      <div></div>
    </aside>
  );
};

export default SideMenu;
