import React, { useState, useEffect, useContext } from "react";
import classes from "./registerViaMail.module.css";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/userContext";
import axios from "axios";

export default function LoginViaMail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("auth-token");
    if (token) {
      navigate("/home");
    }
  }, [userData, navigate]);

  const loginToUser = async (event) => {
    event.preventDefault();
    const temp_url = "http://localhost:5050";
    try {
      const loginCredentials = { email, password };
      const loginResponse = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/login-email`,
        loginCredentials
      );
      setUserData({
        token: loginResponse.token,
        user: loginResponse.data.user,
      });
      localStorage.setItem("auth-token", loginResponse.token);
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div id="authFormContainer" className={classes.authFormContainer}>
        <form onSubmit={loginToUser} className={classes.loginForm}>
          <h2 id="label">Login</h2>
          <label id="label" htmlFor="email" />
          <input
            type="email"
            name="mail"
            placeholder="abc@xyz.com"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label id="label" htmlFor="password" />
          <input
            type="password"
            name="password"
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button id="login-btn" type="submit">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
