import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import axios from "axios";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import { Navbar, Sidebar, ThemeSettings } from "./components";
import {
  Balance,
  History,
  SplitBill,
  Add,
  Pay,
  Request,
  Unaccomplished,
} from "./pages";
import "./App.css";
import jwt_decode from "jwt-decode";

import { useStateContext } from "./contexts/ContextProvider";

let user_balance = "";
let user_records = "";
let activitiesData = [];
let un_activitiesData = [];

const App = () => {
  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
    user,
    setCurrentBalance,
    setUser,
    setRecords,
    setActs,
    setUn_Acts,
    ipaddress,
  } = useStateContext();

  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID token:" + response.credential);
    var userObject = jwt_decode(response.credential);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
    setThemeSettings(false);

    /* First post - check user exist or not*/
    const url1 =
      ipaddress + "/user?user=" + userObject.email + "&name=" + userObject.name;
    axios
      .post(url1, {
        name: userObject.name,
        email: userObject.email,
      })
      .then((res) => {
        console.log(res.data);
      });

    const url2 = ipaddress + "/user/" + userObject.email;
    fetch(url2)
      .then((response) => response.json())
      .then(function (data) {
        user_balance = data.balance;
        user_records = data.transaction;
        setCurrentBalance(user_balance);
        setRecords(user_records);

        activitiesData = [];
        un_activitiesData = [];
        for (let i = 0; i < user_records.length; i++) {
          var url = ipaddress + "/transaction/" + user_records[i];
          fetch(url)
            .then((response) => response.json())
            .then(function (data) {
              if (data.state == true&&data.user2_id==user.email) {
                activitiesData.push({
                  Requester: data.user1_id,
                  BillInformation: data.description,
                  TotalAmount: data.amount,
                  Format: data.type,
                  id: data.transaction_id,
                });
              }
              if (data.state == false) {
                un_activitiesData.push({
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
        setUn_Acts(un_activitiesData);
        console.log("un:" + un_activitiesData);
        console.log("ac:" + activitiesData);
      });
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "723570012453-3dqokee63l5dqbjf9ershas39eb8sncv.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });

    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");
    const currentBalance = localStorage.getItem("balance");
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
      setCurrentBalance(currentBalance);
    }
  }, []);

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <div id="signInDiv" className="mx-80 mt-10 ml-10"></div>
      {
        /* Login*/
        Object.keys(user).length !== 0 ? (
          <BrowserRouter>
            <div className="flex relative dark:bg-main-dark-bg">
              <div
                className="fixed right-4 bottom-4"
                style={{ zIndex: "1000" }}
              >
                <TooltipComponent content="Settings" position="Top">
                  <button
                    type="button"
                    onClick={() => setThemeSettings(true)}
                    style={{ background: currentColor, borderRadius: "50%" }}
                    className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
                  >
                    <FiSettings />
                  </button>
                </TooltipComponent>
              </div>
              {activeMenu ? (
                <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
                  <Sidebar />
                </div>
              ) : (
                <div className="w-0 dark:bg-secondary-dark-bg">
                  <Sidebar />
                </div>
              )}
              <div
                className={
                  activeMenu
                    ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  "
                    : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
                }
              >
                <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
                  <Navbar />
                </div>
                <div>
                  {themeSettings && <ThemeSettings />}

                  <Routes>
                    {/* dashboard  */}
                    <Route path="/" element="" />
                    <Route path="/balance" element={<Balance />} />

                    {/* Features  */}
                    <Route path="/splitbill" element={<SplitBill />} />
                    <Route path="/request" element={<Request />} />
                    <Route path="/pay" element={<Pay />} />
                    <Route path="/add" element={<Add />} />

                    {/* pages  */}
                    <Route path="/history" element={<History />} />
                    <Route
                      path="/unaccomplished"
                      element={<Unaccomplished />}
                    />
                  </Routes>
                </div>
              </div>
            </div>
          </BrowserRouter>
        ) : (
          /* Not login*/
          <div className="App ">
            {user && (
              <div>
                <h3> {user.name} </h3>
              </div>
            )}
          </div>
        )
      }
    </div>
  );
};

export default App;
export { user_balance, user_records, activitiesData };
