import React from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { Popup } from "../components";
import axios from "axios";

const Pay = (props) => {
  const {
    currentColor,
    setPopup,
    popup,
    setCurrentMode,
    user,
    email_to,
    setEmail_to,
    setPayamount,
    payamount,
    paydesc,
    setPaydesc,
    setCurrentBalance,
    setRecords,
    ipaddress,
  } = useStateContext();

  let email = "email";
  let amount = "$19.99";
  let description = "";
  let check = [];

  const handleSubmit = () => {
    if (email_to != null && payamount != null) {
      check = email_to;
      check = check.replace(/\s/g, "");
      var url =
        ipaddress +
        "/request?current=" +
        user.email +
        "&amount=" +
        payamount +
        "&target=" +
        check +
        "&description=" +
        paydesc;
      axios
        .post(url, {
          name: user.name,
        })
        .then((res) => {
          console.log(res.data);
        });
      setPopup(true);
      setEmail_to(null);
      setPayamount(null);
      setPaydesc(null);
      email = "email";
      amount = "$19.99";
      description = "";
      setCurrentMode("Dark");

      var url = ipaddress + "/user/" + user.email;
      fetch(url)
        .then((response) => response.json())
        .then(function (data) {
          console.log(data.balance);
          setCurrentBalance(data.balance);
          setRecords(data.transaction);
        });
    }
  };

  function getDes(val) {
    setEmail_to(val.target.value);
  }

  function getAmount(val) {
    setPayamount(val.target.value);
  }

  function getDesc(val) {
    setPaydesc(val.target.value);
  }

  return (
    <div className="ml-10">
      <div className="formInput mt-6">
        <label
          textcolor={currentColor}
          className="ml-12 text-2xl mt-15 font-bold text-2xl mb-5 text-gray-400"
        >
          Request from:
        </label>
        <div>
          <input
            placeholder={email}
            className="box-border h-12 w-80 p-4 border-4 mt-4 ml-12"
            onChange={getDes}
          />
        </div>
      </div>

      <div className="mt-4">
        <label
          textcolor={currentColor}
          className="ml-12 text-2xl mt-4 font-bold text-2xl mb-5 text-gray-400"
        >
          Amount:
        </label>
        <div>
          <input
            placeholder={amount}
            className="box-border h-12 w-40 p-4 border-4 mt-2 ml-12"
            onChange={getAmount}
          />
        </div>
      </div>

      <div className="mt-4">
        <label
          textcolor={currentColor}
          className="ml-12 text-2xl mt-4 font-bold text-2xl mb-5 text-gray-400"
        >
          Description:
        </label>
        <div>
          <textarea
            placeholder={description}
            className="box-border h-64 w-80 p-4 border-4 mt-2 ml-12"
            onChange={getDesc}
          />
        </div>
      </div>

      <div>
        <button
          onClick={() => handleSubmit()}
          className="mt-5 py-2 px-4 font-mono antialiased font-bold text-base text-white ml-16 rounded-full shadow-md transition ease-in-out delay-120 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
        >
          {" "}
          Submit
        </button>
      </div>
      <Popup trigger={popup}></Popup>
    </div>
  );
};

export default Pay;
