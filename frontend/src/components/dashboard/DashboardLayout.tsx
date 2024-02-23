import { ReactNode, useState } from "react";
import { BiFoodMenu } from "react-icons/bi";
import SideMenu from "./SideMenu";

type DashboardLayoutProps = {
  children: ReactNode;
  pageName: string;
};

const DashboardLayout = ({ children, pageName }: DashboardLayoutProps) => {
  const [open, setOpen] = useState<boolean>(true);

  const changeMenuState = async () => {
    setOpen(!open);
  };

  return (
    <div className="flex w-screen overflow-y-hidden text-white">
      <SideMenu
        open={open}
        changeMenuState={changeMenuState}
        pageName={pageName}
        data-testid={`sidemenu`}
      />
      <div className="w-full h-screen flex flex-col">
        <header className="flex items-center pl-2 py-2 text-sm border-b border-gray-700 bg-second">
          {!open && (
            <div
              className={`rounded-sm py-2 px-2 hover:bg-gray-700 cursor-pointer duration-200`}
              onClick={() => setOpen(!open)}
              data-testid={`hamburger icon`}
            >
              <BiFoodMenu />
            </div>
          )}
          <p className="pl-2 py-2">
            Strona główna / <span className="font-bold">{pageName}</span>
          </p>
        </header>
        <article className="h-full">{children}</article>
      </div>
    </div>
  );
};

export default DashboardLayout;
