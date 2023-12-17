/*
  https://www.youtube.com/watch?v=Y-XW9m8qOis - for login and register form
*/

import React from "react";
// import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import "./App.css";

import { Login } from "./RegisterViaPhone/Login";
import Home from "./Home/Home";
import Phone from "./RegisterViaPhone/Phone";
import { Register } from "./RegisterViaPhone/Register";
import VerifyOtp from "./RegisterViaPhone/VerifyOtp";
import LoginViaMail from "./RegisterViaMail/Login Page/LoginViaMail";
import SignupViaMail from "./RegisterViaMail/Signup Page/SignupViaMail";
import error from "./Error/error";
import Checkout from "./RegisterViaMail/Product Order Series/Checkout";

// let token = localStorage.getItem("auth-token");
// const headers = {
//   "Content-Type": "application/json",
//   Authorization: `Bearer ${token}`,
// };

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Navigate to={"home"} replace />} />
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
    </BrowserRouter>
  );
}

export default App;
