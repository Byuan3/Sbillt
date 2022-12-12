import React from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";

let activitiesData = [];
let un_activitiesData = [];

function Reflash(props) {
  const { setPopup, setCurrentMode, records, setActs, setUn_Acts, user, setCurrentBalance, ipaddress, setRecords } = useStateContext();
  let navigate = useNavigate();

  const handleSubmit = () => {
    setPopup(false);
    setCurrentMode("Light");
    reloadRecords();
    navigate("/balance");
  };

  function reloadRecords() {
    activitiesData = [];
    un_activitiesData = [];

    var url = ipaddress + "/user/" + user.email;
    fetch(url)
      .then((response) => response.json())
      .then(function (data) {
        console.log(data.balance);
        setCurrentBalance(data.balance);
        setRecords(data.transaction);
      });

    for (let i = 0; i < records.length; i++) {
      var url = ipaddress + "/transaction/" + records[i];
      fetch(url)
        .then((response) => response.json())
        .then(function (data) {
          console.log(data)
          if(data.state==false&&data.user2_id==user.email){
            un_activitiesData.push({
              Requester: data.user1_id,
              BillInformation: data.description,
              TotalAmount: data.amount,
              Format: data.type,
              id: data.transaction_id,
            });
          }
          if(data.state==true){
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
    setActs(activitiesData);
    setUn_Acts(un_activitiesData)
  }

  return props.trigger ? (
    <div className="flex justify-center bg-slate-200 h-48 max-h-full mt-10 ">
      <div>
        <div className="mt-10 text-black font-bold text-3xl mr-10">
            Refresh Successfully!!
        </div>
      </div>{" "}
      <div>
        <div className="flex justify-center max-h-full md:max-h-screen mt-20 text-white text-center font-bold text-2xl">
          <button
            className="mt-10 py-2 px-4 font-mono antialiased  ml-10 rounded-full shadow-md transition ease-in-out delay-120 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
            onClick={() => {
              handleSubmit();
            }}
          >
            {" "}
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default Reflash;
export { activitiesData };
