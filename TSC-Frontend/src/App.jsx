/*
  https://www.youtube.com/watch?v=Y-XW9m8qOis - for login and register form
*/

import React, { useEffect, useState } from "react";
// import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import "./App.css";

import { Login } from "./RegisterViaPhone/Login";
import axios from "axios";
import Home from "./Home/Home";
import UserContext from "./contexts/userContext";
import Phone from "./RegisterViaPhone/Phone";
import { Register } from "./RegisterViaPhone/Register";
import VerifyOtp from "./RegisterViaPhone/VerifyOtp";
import LoginViaMail from "./RegisterViaMail/Login Page/LoginViaMail";
import SignupViaMail from "./RegisterViaMail/Signup Page/SignupViaMail";
import error from "./Error/error";
import Checkout from "./RegisterViaMail/Product Order Series/Checkout";

let token = localStorage.getItem("auth-token");
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  useEffect(() => {
    const checkedIfLoggedIn = async () => {
      if (!token) {
        localStorage.setItem("auth-token", "");
        token = "hey";
        setUserData({
          token,
          undefined,
        });
        return;
      }
      try {
        const tokenResponse = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/auth/isTokenValid`,
          null,
          headers
        );

        if (tokenResponse.data) {
          const userRes = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/auth`,
            {
              headers: headers,
            }
          );
          setUserData({
            token,
            user: userRes.data,
          });
        }
      } catch (err) {
        localStorage.setItem("auth-token", "");
        setUserData({
          token,
          undefined,
        });
      }
    };
    checkedIfLoggedIn();
  }, []);

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ userData, setUserData }}>
        <Routes>
          <Route path="/">
            <Route index element={<Navigate to={"login-email"} replace />} />
            <Route exact path="login-phone" Component={Login} />
            <Route exact path="login-email" Component={LoginViaMail} />
            <Route exact path="home" Component={Home} />
            <Route exact path="register" Component={Register} />
            <Route exact path="signup-email" Component={SignupViaMail} />
            <Route exact path="phone-verify" Component={Phone} />
            <Route exact path="otp-verify" Component={VerifyOtp} />
            <Route exact path="checkout" Component={Checkout} />
            <Route exact path="error" Component={error} />
          </Route>
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
