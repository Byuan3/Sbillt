import React from "react";
import { useStateContext } from "../contexts/ContextProvider";


const BalanceDisplay = () => {
  const { balance } = useStateContext();
  return (
    <div className="text-4xl font-bold delay-100 hover:-translate-y-1 hover:scale-110 duration-300">
      ${balance}
    </div>
  );
};

export default BalanceDisplay;
