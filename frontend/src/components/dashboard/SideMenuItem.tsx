import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

type SideMenuItemProps = {
  icon: ReactNode;
  text: string;
  link: string;
  isSelected: boolean;
};

const SideMenuItem = ({ icon, text, link, isSelected }: SideMenuItemProps) => {
  return (
    <Link to={link}>
      <li
        className={`flex items-center px-3 py-1 mx-0.5 mb-0.5 rounded-sm hover:bg-gray-700 duration-200 cursor-pointer${
          isSelected ? "bg-gray-700" : ""
        }`}
      >
        <div
          className={`w-[3px] h-5 mr-1 rounded-md ${
            isSelected ? "bg-fourth" : ""
          }`}
        ></div>
        <span className={`text-gray-400`}>{icon}</span>
        <p className="ml-3 font-light">{text}</p>
      </li>
    </Link>
  );
};

export default SideMenuItem;
