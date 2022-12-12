import React from "react";
import { GrPowerCycle } from "react-icons/gr";
import { useStateContext } from "../contexts/ContextProvider";
import { BalanceDisplay } from "../components";
import { Reflash } from "../components";

const Balance = () => {
  const {
    currentColor,
    user,
    setCurrentBalance,
    ipaddress,
    setPopup,
    popup,
    setRecords,
    setCurrentMode,
  } = useStateContext();

  let activitiesData = [];
  let un_activitiesData = [];
  let reco = [];

  function update() {
    setPopup(true);
    setCurrentMode("Dark");
    var url = ipaddress + "/user/" + user.email;
    fetch(url)
      .then((response) => response.json())
      .then(function (data) {
        console.log(data.balance);
        setCurrentBalance(data.balance);
        setRecords(data.transaction);
      });

    activitiesData = [];
    un_activitiesData = [];
    for (let i = 0; i < reco.length; i++) {
      var url2 = ipaddress + "/transaction/" + reco[i];
      fetch(url2)
        .then((response) => response.json())
        .then(function (data) {
          console.log(data);
          if (data.state == false&&data.user2_id==user.email) {
            un_activitiesData.push({
              Requester: data.user1_id,
              BillInformation: data.description,
              TotalAmount: data.amount,
              Format: data.type,
              id: data.transaction_id,
            });
          }
          if (data.state == true) {
            activitiesData.push({
              Requester: data.user1_id,
              BillInformation: data.description,
              TotalAmount: data.amount,
              Format: data.type,
              id: data.transaction_id,
            });
          }
        });
    }
  }

  return (
    <div className="mt-16">
      <div className="flex flex-wrap lg:flex-nowrap justify-center ">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-68 rounded-xl w-full lg:w-50 p-10 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-2xl mb-5 text-gray-400">Balance</p>
              <BalanceDisplay></BalanceDisplay>
            </div>
            <button
              onClick={() => update()}
              type="button"
              style={{ backgroundColor: currentColor }}
              className="text-3xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full  p-4"
            >
              <GrPowerCycle />
            </button>
          </div>
          <Reflash trigger={popup}></Reflash>
        </div>
      </div>
    </div>
  );
};

export default Balance;
