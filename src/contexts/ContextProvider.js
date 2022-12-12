import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState('#03C9D7');
  const [currentMode, setCurrentMode] = useState('Light');
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [login, setLogin] = useState(false)
  const [user, setUser] = useState({})
  const [balance, setCurrentBalance] = useState({})
  const [records, setRecords] = useState({})
  const [acts, setActs] = useState({})
  const [un_acts, setUn_Acts] = useState({})
  const [recharge, setRecharge] = useState("")
  const [email_to, setEmail_to] = useState("")
  const [payamount, setPayamount] = useState("")
  const [paydesc, setPaydesc] = useState("")
  const [popup, setPopup] = useState(false)
  const ipaddress = "http://54.151.117.239:8000";

  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem('themeMode', e.target.value);
  };

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem('colorMode', color);
  };

  function Logout(event){
    setUser({});
    window.location.href = "/";
    document.getElementById("signInDiv").hidden = false;
    window.location.reload(true);
  };

  let user_balance = [];

  function getUserInfo(e){
    const url = ipaddress + '/user/' + user.email;
    fetch(url)
    .then((response) => response.json())
    .then(function(data){
      console.log(data);
      user_balance = data.balance;
      console.log("bal:" + user_balance);
    });
  }
  
  function postUserInfo(e){
    const url = ipaddress + "/user?user=" + user.email + "&name=" + user.name;
    axios.post(url, {
      name: user.name,
      email: user.email
    })
    .then(res=> {
      console.log(res.data)
    })
  }

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider value={{ currentColor, currentMode, activeMenu, screenSize, login, user, recharge ,un_acts, balance, popup, ipaddress,  email_to, paydesc, payamount, records, setUn_Acts, setPaydesc, setActs, acts, setRecords, setEmail_to, setPayamount, setPopup, setScreenSize, setRecharge, setCurrentBalance, postUserInfo, getUserInfo, Logout, setUser, setLogin, setActiveMenu, setCurrentColor, setCurrentMode, setMode, setColor, themeSettings, setThemeSettings }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
