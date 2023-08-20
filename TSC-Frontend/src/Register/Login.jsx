import axios from "axios";
import React, { useState } from "react";

export const Login = (props) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [cookie, setCookie] = useState("");

  const loginByPassword = (event) => {
    event.preventDefault();
    console.log(phone);

    axios
      .post(`http://localhost:${process.env.PORT}/auth/login`, {
        phone: phone,
        password: password,
      })
      .then(setCookie(cookie))
      .catch((err) => console.log(err));
  };

  return (
    <div className="auth-form-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={loginByPassword}>
        <label htmlFor="phone">Phone</label>
        <input
          value={phone}
          type="tel"
          placeholder="+91-XXXXX-XXXXX"
          id="phone"
          pattern="[0-9]{5}-[0-9]{5}"
          name="phone"
        />

        <label htmlFor="password">Password</label>
        <input
          value={password}
          type="password"
          placeholder="********"
          id="password"
          name="password"
        />

        <button type="submit"> Login </button>
      </form>

      <button
        className="link-btn"
        onClick={() => props.onFormSwitch("register")}
      >
        {" "}
        Don't have an account? Register here.{" "}
      </button>
    </div>
  );
};
