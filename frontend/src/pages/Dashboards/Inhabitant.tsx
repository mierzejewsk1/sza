import { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { HOST_ADDRESS, CUSTOM_SERVER_CODE } from "../../config/Enum";
import { useAuth } from "../../context/AuthContext";
import Announcement from "../../components/dashboard/Announcement";
import { useUserData } from "../../hooks/useUserData";

interface AnnouncementsModel {
  informationSubject: string;
  userName: string;
  informationDescription: string;
}

const Inhabitant = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementsModel[]>([]);
  const [fetchMsg, setFetchMsg] = useState<string | null>(null);
  const { user } = useAuth();
  const { loggedUserData, fetchMessage } = useUserData();
  const amountOfArticles = useRef(6);

  const GetAnnouncements = async () => {
    const requestData = {
      amountOfArticles: amountOfArticles.current,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(requestData),
    };
    const response = await fetch(
      `${HOST_ADDRESS}/information/get-information`,
      requestOptions
    );

    if (response.ok) {
      const data = await response.json();
      setAnnouncements(data.informationData);
    } else {
      const msg: string = await response.headers.get("response-header");
      setFetchMsg(CUSTOM_SERVER_CODE[msg]);
    }
  };

  useEffect(() => {
    GetAnnouncements();
  }, []);

  return (
    <DashboardLayout pageName="Mieszkaniec">
      <article className="h-full w-full flex justify-center bg-second">
        <section className="w-full px-10 min-w-[400px] sm:max-w-[400px] h-full pt-5 pb-20 overflow-y-scroll my-2 rounded-sm">
          <p className="text-[30px] mb-5">Karta mieszkańca</p>
          <div className="flex justify-center flex-col text-lg p-5 rounded-sm">
            <div className="flex justify-center">
              {loggedUserData && loggedUserData.userImage !== null ? (
                <img
                  src={`${HOST_ADDRESS}/images/${
                    loggedUserData && loggedUserData.userImage
                  }`}
                  className="w-40 pb-5"
                ></img>
              ) : (
                <img
                  src={`${HOST_ADDRESS}/images/lack_of_profile.png`}
                  className="w-40 pb-5"
                ></img>
              )}
            </div>
            <section className="h-20">
              <p className="text-gray-500">Imie i nazwisko:</p>
              {<p>{loggedUserData && loggedUserData.userName}</p>}
            </section>
            <div className="flex h-20">
              <section className="w-full">
                <p className="w-full text-gray-500">Wydział:</p>
                <p className="w-full">
                  {loggedUserData && loggedUserData.userDepartment}
                </p>
              </section>
              <section className="w-full pl-10">
                <p className="w-full text-gray-500">Nr pokoju:</p>
                <p className="w-full">
                  {loggedUserData && loggedUserData.userRoomNumber
                    ? loggedUserData.userRoomNumber
                    : `brak`}
                </p>
              </section>
            </div>
            <section className="h-20">
              <p className="text-gray-500">Kierunek</p>
              <p>{loggedUserData && loggedUserData.userFieldOfStudy}</p>
            </section>
            <section className="w-full flex justify-center mt-2 ">
              <QRCode
                className="p-2 bg-white"
                value={`http://localhost:5173/qr-profile-info/?userId=${
                  loggedUserData && loggedUserData.userID
                }`}
                xlinkTitle={`Szczegółowe informacje o użytkowniku ${
                  loggedUserData && loggedUserData.userID
                }`}
                bgColor="white"
                fgColor="black"
                size={200}
              />
            </section>
          </div>
        </section>
        <section className="w-full hidden 2xl:flex min-[2000px]:w-[60%] flex-col px-10 overflow-y-scroll my-2 pb-20 border-l border-gray-700">
          <p className={`pt-5 pb-5 text-[30px] self-start p-0`}>Ogłoszenia</p>
          {announcements &&
            announcements.map((item, index) => (
              <Announcement
                key={index}
                informationSubject={item.informationSubject}
                userName={item.userName}
                informationDescription={item.informationDescription}
              />
            ))}
        </section>
      </article>
    </DashboardLayout>
  );
};

export default Inhabitant;
