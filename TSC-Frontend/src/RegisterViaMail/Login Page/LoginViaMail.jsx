import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../contexts/userContext";
import axios from "axios";

export default function LoginViaMail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // eslint-disable-next-line
  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  let token = localStorage.getItem("auth-token");
  useEffect(() => {
    if (token) {
      try {
        navigate("/home");
      } catch (error) {
        console.error("Error navigating to /home:", error);
      }
    }
  });

  const loginToUser = async (event) => {
    event.preventDefault();
    try {
      const loginCredentials = { email, password };
      const loginResponse = await axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/auth/login-email`,
          loginCredentials
        )
        .catch((error) => {
          alert(error);
        });
      setUserData({
        token: loginResponse.token,
        user: loginResponse.data.user,
      });
      localStorage.setItem("auth-token", loginResponse.token);
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="center">
        <input type="checkbox" id="show" />
        <label for="show" className="show-btn">
          View Form
        </label>
        <div className="container">
          <label for="show" className="close-btn fas fa-times" title="close">
            x
          </label>
          <div className="text">Login Form</div>
          <form onSubmit={loginToUser}>
            <div className="data">
              <label>Email or Phone</label>
              <input
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="data">
              <label>Password</label>
              <input
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="forgot-pass">
              <p>Forgot Password?</p>
            </div>
            <div className="btn">
              <div className="inner"></div>
              <button type="submit">login</button>
            </div>
            <div className="signup-link">
              Not a member?<Link to="/signup-email">Signup Now</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
