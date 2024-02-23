import useLogout from "../../hooks/useLogout";

type AvatarSubMenuProps = {
  userName: string;
  userEmail: string;
};

const AvatarSubMenu = ({ userName, userEmail }: AvatarSubMenuProps) => {
  const { Logout, fetchMessage } = useLogout();

  return (
    <div
      className={`absolute left-0 w-full z-10`}
      data-testid={`avatar submenu`}
    >
      <div
        className={`mx-1 py-1 bg-neutral-700 rounded-md border border-slate-500`}
      >
        <div className={`border-b border-slate-500 px-2 pb-2`}>
          <p>{userName}</p>
          <p className={`text-sm`}>{userEmail}</p>
        </div>
        <ul className={`px-0.5 text-sm py-1 border-b border-slate-500`}>
          <li
            className={`px-2 py-1 rounded-sm hover:bg-gray-800 cursor-pointer`}
          >
            Edytuj profil
          </li>
          <li
            className={`px-2 py-1 rounded-sm  hover:bg-gray-800 cursor-pointer`}
          >
            Preferencje
          </li>
          <li
            className={`px-2 py-1 rounded-sm  hover:bg-gray-800 cursor-pointer`}
          >
            Nowości
          </li>
        </ul>
        <p
          className={`mx-0.5 mt-1 px-2 py-1 rounded-sm text-sm cursor-pointer hover:bg-gray-800`}
          onClick={Logout}
        >
          Wyloguj się
        </p>
      </div>
    </div>
  );
};

export default AvatarSubMenu;
