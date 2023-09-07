import React, { useState } from "react";
import axios from "axios";
import classes from "./register.module.css";
import { Link } from "react-router-dom";

export default function Phone() {
  const [phone, setPhone] = useState("");

  const phoneVerify = async (event) => {
    event.preventDefault();

    try {
      const message = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/otp`,
        {
          phone: phone,
        }
      );
      console.log(message.data);
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else {
        console.log("Registration Failed");
      }
    }
  };

  return (
    <div id="authFormContainer" className={classes.authFormContainer}>
      <h2 id="label">Register</h2>
      <form className={classes.registerForm}>
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

        <button id="link" onClick={phoneVerify}>
          <Link to={"/otp-verify"}>Verify Phone Number </Link>
        </button>
      </form>
    </div>
  );
}
