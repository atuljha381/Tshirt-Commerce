import React, { useState } from "react";
import axios from "axios";
import classes from "./register.module.css";
import { Link } from "react-router-dom";

export const Register = (props) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const signupByPhone = async (event) => {
    console.log("entered");
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:5050/auth/signup", {
        phone: phone,
        password: password,
      });
      console.log(response.data);
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else if (err.response?.status === 409) {
        console.log("Username Taken");
      } else {
        console.log("Registration Failed");
      }
    }
  };

  return (
    <div id="authFormContainer" className={classes.authFormContainer}>
      <h2 id="label">Register</h2>
      <form className={classes.registerForm}>
        <label htmlFor="register">Register page goes here</label>

        <button onClick={signupByPhone} id="link">
          <Link to={"/login"}>Send OTP </Link>
        </button>
      </form>
    </div>
  );
};
