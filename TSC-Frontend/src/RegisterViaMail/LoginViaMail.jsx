import React, { useState } from "react";
import classes from "./registerViaMail.module.css";

export default function LoginViaMail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginToUser = (event) => {
    event.preventDefault();
    
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
