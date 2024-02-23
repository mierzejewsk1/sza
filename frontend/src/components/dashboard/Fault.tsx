import { CiCircleCheck } from "react-icons/ci";

interface FaultProps {
  roomNumber: string;
  faultDescription: string;
  faultID: number;
}

const Fault = ({ roomNumber, faultDescription, faultID }: FaultProps) => {
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
            //onClick={() => SetFaultAsDone(item.faultID)}
            className="w-10 h-10 cursor-pointer hover:text-green-500 duration-200 self-center"
          />
        </div>
      </div>
    </article>
  );
};

export default Fault;
