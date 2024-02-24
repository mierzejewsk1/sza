import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { HOST_ADDRESS, CUSTOM_SERVER_CODE } from "../../config/Enum";
import { useAuth } from "../../context/AuthContext";
import Fault from "../../components/dashboard/Fault";

interface FaultModel {
  faultID: number;
  roomNumber: string;
  faultDescription: string;
}

const Conservator = () => {
  const { user } = useAuth();
  const [undoneFaults, setUndoneFaults] = useState<FaultModel[] | undefined>(
    undefined
  );
  const [fetchMsg, setFetchMsg] = useState<string | null>(null);

  const GetUndoneFaults = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    const response = await fetch(
      `${HOST_ADDRESS}/faults/get-all-undone-faults`,
      requestOptions
    );

    if (response.ok) {
      const data = await response.json();
      setUndoneFaults(data.faultsData);
    } else {
      const msg: string = await response.headers.get("response-header");
      setFetchMsg(CUSTOM_SERVER_CODE[msg]);
    }
  };

  useEffect(() => {
    GetUndoneFaults();
  }, []);

  return (
    <DashboardLayout pageName="Konserwator">
      <article className="h-full w-full flex justify-center bg-second">
        <section className="w-full flex min-[1500px]:w-[900px] flex-col px-10 overflow-y-scroll my-2 pb-20">
          <p className={`pt-5 pb-5 text-[30px] self-start p-0`}>Usterki</p>
          {undoneFaults &&
            undoneFaults.map((item, index) => (
              <Fault
                key={index}
                roomNumber={item.roomNumber}
                faultDescription={item.faultDescription}
                faultID={item.faultID}
                getUndoneFaults={GetUndoneFaults}
              />
            ))}
        </section>
      </article>
    </DashboardLayout>
  );
};

export default Conservator;
