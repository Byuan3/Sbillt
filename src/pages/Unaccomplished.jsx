import React from "react";
import { MdPayment } from "react-icons/md";
import {
  GridComponent,
  Page,
  Selection,
  Inject,
  Edit,
  Toolbar,
  Sort,
  Filter,
} from "@syncfusion/ej2-react-grids";
import { Fdisplay, Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { Popup } from "../components";

const Unaccomplished = () => {
  const selectionsettings = { persistSelection: true };
  const { un_acts, ipaddress, user, setPopup, popup, setCurrentMode} = useStateContext();

  console.log(un_acts);
  let url = [];

  function update(){
    setPopup(true);
    setCurrentMode("Dark");
    for (let i = 0; i < un_acts.length; i++){
      url = ipaddress + "/confirm/" + un_acts[i].id + "?current=" + user.email;
      console.log(url);
      fetch(url, {
        method: "PUT",
      });
    }
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div>
        <Header category="Page" title="Unaccomplished">
        </Header>
        <p className="absolute top-0 right-0 h-16 w-16 mr-52 mt-40 font-bold text-2xl mb-5">Pay</p>
        <button
          type="button"
          onClick={() => update()}
          className="text-3xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full p-4 absolute top-0 right-0 h-16 w-16 mr-36 mt-36 transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
        >
          <MdPayment />
        </button>
      </div>
      <GridComponent
        dataSource={un_acts}
        enableHover={false}
        allowPaging
        pageSettings={{ pageCount: 5 }}
        selectionSettings={selectionsettings}
        allowSorting
      >
        <Fdisplay></Fdisplay>
        <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter]} />
      </GridComponent>
      <Popup trigger={popup}></Popup>
    </div>
  );
};
export default Unaccomplished;
