import React, { useState } from "react";
import axios from "axios";
import classes from "./register.module.css";
import { Link } from "react-router-dom";

export default function VerifyOtp() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const isOtpValid = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5050/auth/otp-verify",
        {
          phone: phone,
          otp: otp,
        }
      );
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
      <h2 id="label">Verify OTP</h2>
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
          disabled="true"
        />

        <label id="label" htmlFor="phone">
          Enter Your OTP
        </label>
        <input
          value={otp}
          type="otp"
          placeholder="XXXXXX"
          id="otp"
          pattern="[0-9]{6}"
          name="otp"
          onChange={(e) => {
            setOtp(e.target.value);
          }}
        />

        <button onClick={isOtpValid} id="link">
          <Link to={"/register"}>Verify OTP </Link>
        </button>
      </form>
    </div>
  );
}
