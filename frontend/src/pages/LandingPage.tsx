import Header from "../components/landingPage/Header";
import Card from "../components/landingPage/Card";
import LoginButton from "../components/buttons/LoginButton";
import {
  RiCalendarCheckLine,
  RiDownloadCloud2Line,
  RiExchangeDollarLine,
  RiLineChartFill,
} from "react-icons/ri";
import { HiOutlineBanknotes } from "react-icons/hi2";
import { MdOutlineHeadsetMic } from "react-icons/md";
import Logo from "../assets/images/logo3.png";
import FunctionallityIcon from "../components/landingPage/FunctionallityIcon";

const LandingPage = () => {
  return (
    <div className="relative transition flex flex-col w-full">
      <div
        className={`flex justify-center items-center w-full h-10 lg:px-10 text-sm bg-bkg1 text-txt1`}
      >
        <p>Skorzystaj z zimowych promocji na nasze oprogramowanie!</p>
      </div>
      <Header />
      <section className="flex flex-col 2xl:flex-row items-center justify-center bg-cover bg-hero-pattern 2xl:pl-32 2xl:pr-16 px-5 py-10 overflow-y-hidden gap-6">
        <div className="2xl:min-w-[400px] 2xl:h-[400px] py-10 2xl:mr-10">
          <p className="font-bold text-[30px] 2xl:text-[40px]">
            Szybciej. Wydajniej.
          </p>
          <p className="text-md 2xl:text-xl my-8">
            System zarządzania domem studenckim dla Twojego akademika
          </p>
          <LoginButton />
        </div>
        <Card isLatestTagVisible={true}>
          Prostsze zarządzanie akademikiem poprzez możliwość zdalnego wyboru
          pokoju. Oszczędność czasu i pieniędzy.
        </Card>
        <Card isLatestTagVisible={false}>
          Komunikacja pomiędzy administracją a mieszkańcami dużo prostsza z
          wykorzystaniem Naszej aplikacji.
        </Card>
      </section>
      <section className="w-full min-[2000px]:px-[30%] pb-[200px] flex flex-col 2xl:flex-row justify-center items-center 2xl:items-start self-center pt-20 2xl:px-32 gap-10 min-[2500px]:gap-[100px] bg-bkg text-txt">
        <FunctionallityIcon
          icon={<RiCalendarCheckLine className={`w-10 h-10`} />}
          title={`Planuj czynności`}
          description={"Zaplanuj skorzystanie z pralni. Zaplanuj odwiedziny"}
        />
        <FunctionallityIcon
          icon={<RiCalendarCheckLine className={`w-10 h-10`} />}
          title={`Raporty`}
          description={"Generuj dane o użytkownikach systemu"}
        />
        <FunctionallityIcon
          icon={<RiExchangeDollarLine className={`w-10 h-10`} />}
          title={`Płatności`}
          description={`Opłać czynsz za mieszkanie. Dokonuj wszystkich ważnych płatności w aplkacji`}
        />
        <FunctionallityIcon
          icon={<RiLineChartFill className={`w-10 h-10`} />}
          title={`Wykresy`}
          description={
            "Generuj wykresy przychodów, wydatków. AI zrobi analizę za Ciebie!"
          }
        />
      </section>
      <footer className="relative flex flex-col items-center bg-black min-h-[500px]">
        <section
          className={`translate-y-[-100px] flex flex-col lg:flex-row items-center lg:justify-center h-auto lg:h-[250px] w-[90%] min-[1500px]:w-[70%] min-[2000px]:w-[60%] bg-gray-700 rounded-md border text-white px-10 gap-10 lg:gap-0 py-5 lg:py-0`}
        >
          <div className="w-full lg:w-[50%] h-[80%] ">
            <p className={`text-2xl lg:text-[40px] font-bold`}>
              Gotowy, aby zacząć?
            </p>
            <p className={`text-xl lg:text-[20px] my-5`}>
              Zobacz co Twój zespół może zrobić dzięki platformie SZA
            </p>
            <LoginButton />
          </div>
          <div className={`w-full lg:w-[25%] h-[70%] mx-5`}>
            <HiOutlineBanknotes className="w-10 h-10 mb-5" />
            <p>Sprawdź, który plan najbardziej pasuje do twojego zespołu.</p>
            <p
              className={`hover:underline underline-offset-4 mt-5 cursor-pointer transition`}
            >
              Dowiedz się o cenach
            </p>
          </div>
          <div className={`w-full lg:w-[25%] h-[70%]`}>
            <MdOutlineHeadsetMic className="w-10 h-10 mb-5" />
            <p>Dowiedz się więcej co SZA może zrobić dla twojego akademika.</p>
            <p
              className={`hover:underline underline-offset-4 mt-5 cursor-pointer hover:transition`}
            >
              Porozmawiaj z ekspertem
            </p>
          </div>
        </section>
        <section className="w-[70%] lg:w-full flex flex-col lg:flex-row justify-center">
          <img
            src={Logo}
            alt="Main page logos"
            className={`h-10 w-20 lg:mr-20`}
          ></img>
          <ul
            className={`flex flex-col lg:flex-row gap-10 lg:gap-20 py-5 lg:py-0 lg:px-10 text-white`}
          >
            <li className={`cursor-pointer`}>
              <p className="text-lg">Strona główna</p>
            </li>
            <li className={`cursor-pointer`}>
              <p className="text-lg mb-5">Cennik</p>
              <ul>
                <li className="hover:underline underline-offset-4">
                  Zobacz plany
                </li>
              </ul>
            </li>
            <li className={`cursor-pointer`}>
              <p className="text-lg mb-5">Dlaczego SZA?</p>
              <ul>
                <li className="hover:underline underline-offset-4">
                  Podręcznik
                </li>
                <li className="hover:underline underline-offset-4">Zespół</li>
                <li className="hover:underline underline-offset-4">
                  Relacje inwestorskie
                </li>
                <li className="hover:underline underline-offset-4">
                  Portal klienta
                </li>
                <li className="hover:underline underline-offset-4">
                  Dokumentacja produktu
                </li>
              </ul>
            </li>
            <li className={`cursor-pointer`}>
              <p className="text-lg mb-5">Kontakt</p>
              <ul>
                <li className="hover:underline underline-offset-4">Siedziba</li>
                <li className="hover:underline underline-offset-4">Telefon</li>
              </ul>
            </li>
          </ul>
        </section>
        <section
          className={`w-[80%] lg:w-[70%] min-[1700px]:w-[50%] border-t mt-16 lg:mt-36 text-white py-5`}
        >
          <p>
            SZA jest znakiem towarowym firmy Mierzej Industries, a korzystanie z
            „SZA” odbywa się na podstawie licencji
          </p>
          <p>© 2024 SZA B.V.</p>
        </section>
      </footer>
    </div>
  );
};

export default LandingPage;
