import React, { useState } from "react";
import classes from "./registerViaMail.module.css";
export default function SignupViaMail() {
  const [email, setEmail] = useState("");
  const [firstName, setFname] = useState("");
  const [lastName, setLname] = useState("");
  const [password, setPassword] = useState("");

  const signupUser = (event) => {
    event.preventDefault();
    
  };
  return (
    <>
      <div id="authFormContainer" className={classes.authFormContainer}>
        <form onSubmit={signupUser} className={classes.registerForm}>
          <h2 id="label">Register</h2>
          <label htmlFor="fname" id="label" />
          <input
            type="text"
            name="fname"
            placeholder="First Name"
            onChange={(e) => setFname(e.target.value)}
          />
          <label htmlFor="lname" id="label" />
          <input
            type="text"
            name="lname"
            placeholder="Last Name"
            onChange={(e) => setLname(e.target.value)}
          />
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
