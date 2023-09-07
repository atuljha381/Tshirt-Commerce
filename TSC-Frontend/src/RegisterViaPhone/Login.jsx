import axios from "axios";
import classes from "./register.module.css";
import React, { useContext, useState, useEffect } from "react";
import userContext from "../contexts/userContext";
import { Link, useNavigate } from "react-router-dom";

export const Login = (props) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { userData, setUserData } = useContext(userContext);
  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("auth-token");
    if (token && userData.user) {
      navigate("/home");
    }
  }, [userData, navigate]);

  const submit = async (event) => {
    event.preventDefault();
    const credentials = { phone, password };
    try {
      const loginResponse = await axios.post(
        `${process.env.BACKEND_URL}/auth/login`,
        credentials
      );
      setUserData({
        token: loginResponse.data.token,
        user: loginResponse.data.user,
      });
      localStorage.setItem("auth-token", loginResponse.data.token);
      setPhone("");
      setPassword("");
      navigate("/");
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
      alert(error);
    }
  };

  return (
    <div id="authFormContainer" className={classes.authFormContainer}>
      <form className={classes.loginForm}>
        <h2 id="label">Login</h2>
        <label id="label" htmlFor="phone">
          Phone
        </label>
        <input
          value={phone}
          type="tel"
          placeholder="+91-XXXXX-XXXXX"
          id="phone"
          pattern="[0-9]{5}-[0-9]{5}"
          name="phone"
          onChange={(e) => setPhone(e.target.value)}
        />

        <label id="label" htmlFor="password">
          Password
        </label>
        <input
          value={password}
          type="password"
          placeholder="********"
          id="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button id="login-btn" onClick={submit}>
          {" "}
          Login{" "}
        </button>
      </form>

      <button className={classes.linkBtn}>
        <Link to={"/phone-verify"} id="label">
          Don't have an account? Register here.
        </Link>
      </button>
    </div>
  );
};
