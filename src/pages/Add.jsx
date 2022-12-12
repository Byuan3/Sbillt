import React from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { Popup } from "../components";

const Add = (props) => {
  const {
    currentColor,
    recharge,
    setRecharge,
    setPopup,
    popup,
    setCurrentMode,
    user,
    setCurrentBalance,
    setRecords,
    ipaddress,
  } = useStateContext();

  let pl = "$19.99";

  const handleSubmit = () => {
    if (recharge != null) {
      console.log(recharge);
      setPopup(true);
      setRecharge(null);
      var url =
        ipaddress + "/balance?current=" + user.email + "&amount=" + recharge;
      console.log(url);
      fetch(url, {
        method: "PUT",
      });
      pl = "$19.99";
      setCurrentMode("Dark");

      var url2 = ipaddress + "/user/" + user.email;
      fetch(url2)
        .then((response) => response.json())
        .then(function (data) {
          console.log(data.balance);
          setCurrentBalance(data.balance);
          setRecords(data.transaction);
        });
    }
  };

  function getData(val) {
    setRecharge(val.target.value);
  }

  return (
    <div className="mt-32 ml-10">
      <div className="formInput mt-15">
        <label
          textcolor={currentColor}
          className="ml-12 text-3xl mt-15 font-bold text-2xl mb-5 text-gray-400"
        >
          Add Credit:
        </label>
        <div>
          <input
            placeholder={pl}
            className="box-border h-12 w-32 p-4 border-4 mt-8 ml-16"
            onChange={getData}
          />
        </div>
        <div>
          <button
            onClick={() => handleSubmit()}
            className="mt-10 py-2 px-4 font-mono antialiased font-bold text-base text-white ml-16 rounded-full shadow-md transition ease-in-out delay-120 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
          >
            {" "}
            Submit
          </button>
        </div>
        <Popup trigger={popup}></Popup>
      </div>
    </div>
  );
};

export default Add;
