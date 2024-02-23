import { ReactNode } from "react";
import Obraz1 from "../../assets/images/Obraz1.png";
import { IoIosArrowForward } from "react-icons/io";

type CardProps = {
  isLatestTagVisible: boolean;
  children: ReactNode;
};

const Card = ({ children, isLatestTagVisible }: CardProps) => {
  return (
    <div className="group relative flex flex-col bg-bkg p-5 h-[500px] w-full 2xl:w-[500px] rounded-md hover:translate-y-[-5px] transition cursor-pointer">
      <img
        src={Obraz1}
        alt="View of room select page"
        className={`w-[500px] 2xl:w-[100%] mb-5 self-center`}
      ></img>
      <div>
        {isLatestTagVisible && (
          <div
            className={`bg-purple-400 inline rounded-2xl py-1 px-5 my-5 font-semibold`}
          >
            Nowość!
          </div>
        )}
        <p className={`text-xl mt-5 text-txt`}>{children}</p>
        <div className="flex items-center absolute bottom-8">
          <p
            className={`relative text-lg group-hover:underline underline-offset-4 transition text-txt`}
          >
            Czytaj więcej
          </p>
          <span className={`group-hover:translate-x-1 transition text-txt`}>
            <IoIosArrowForward />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
