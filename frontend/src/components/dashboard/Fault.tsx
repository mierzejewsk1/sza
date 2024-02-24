import { CiCircleCheck } from "react-icons/ci";
import { HOST_ADDRESS, CUSTOM_SERVER_CODE } from "../../config/Enum";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
interface FaultProps {
  roomNumber: string;
  faultDescription: string;
  faultID: number;
  getUndoneFaults: () => void;
}

const Fault = ({
  roomNumber,
  faultDescription,
  faultID,
  getUndoneFaults,
}: FaultProps) => {
  const { user } = useAuth();
  const [fetchMsg, setFetchMsg] = useState<string | null>(null);

  const MarkFaultAsDone = async (faultID: number) => {
    const requestOptions = {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ faultID }),
    };
    const response = await fetch(
      `${HOST_ADDRESS}/faults/set-fault-as-done`,
      requestOptions
    );

    const msg: string = await response.headers.get("response-header");
    setFetchMsg(CUSTOM_SERVER_CODE[msg]);
    getUndoneFaults();
  };

  return (
    <article
      className={`w-full px-8 py-5 pt-5 flex flex-col sm:flex-row mb-3 rounded-sm bg-first`}
    >
      <div className="flex self-center flex-col justify-center items-center sm:gap-2">
        <p className="text-center">Numer pokoju</p>
        <p className="text-lg font-bold">{roomNumber}</p>
      </div>
      <div className="flex flex-col sm:flex-row w-full sm:ml-5 justify-between gap-8 mr-2">
        <div className="overflow-y-hidden text-justify flex flex-col">
          <p className="text-gray-500 text-sm">Opis:</p>
          <p className="text-lg">{faultDescription}</p>
        </div>
        <div className="flex justify-end sm:jusitfy-start">
          <CiCircleCheck
            onClick={() => MarkFaultAsDone(faultID)}
            className="w-10 h-10 cursor-pointer hover:text-green-500 duration-200 self-center"
          />
        </div>
      </div>
    </article>
  );
};

export default Fault;
