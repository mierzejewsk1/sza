import { Link } from "react-router-dom";

type AnnouncementProps = {
  informationSubject: string;
  userName: string;
  informationDescription: string;
};

const Announcement = ({
  informationSubject,
  userName,
  informationDescription,
}: AnnouncementProps) => {
  return (
    <article
      className={`w-full px-8 py-5 pt-5 flex flex-col mb-3 rounded-sm bg-first`}
    >
      <div className="flex flex-col lg:flex-row  lg:items-center mb-5 w-full">
        <p className="text-[20px] w-[100%] pr-5 lg:w-[60%]">
          {informationSubject}
        </p>
        <p className="text-gray-400 w-[100%] mt-2 lg:mt-0 lg:text-right lg:w-[40%]">
          Autor: {userName}
        </p>
      </div>
      <p className=" overflow-y-hidden text-sm min-[1700px]:text-md">
        {informationDescription}
      </p>
      <span className="mt-5 self-end cursor-pointer bg-third px-3 py-1 rounded-md text-sm hover:bg-fourth transition">
        <Link to="/information" className={`font-normal`}>
          Czytaj dalej
        </Link>
      </span>
    </article>
  );
};

export default Announcement;
