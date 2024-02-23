import { ReactNode } from "react";

type FunctionallityIconProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

const FunctionallityIcon = ({
  icon,
  title,
  description,
}: FunctionallityIconProps) => {
  return (
    <div className={`w-[230px] flex flex-col items-center`}>
      {icon}
      <p className={`font-bold text-2xl `}>{title}</p>
      <p className="text-center">{description}</p>
    </div>
  );
};

export default FunctionallityIcon;
