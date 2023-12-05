// eslint-disable-next-line
import React, { useContext, useEffect } from "react";
import UserContext from "../contexts/userContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);
  useEffect(() => {
    if (!userData.user) {
      navigate("/login-email");
    }
  }, [userData.user, navigate]);

  const logOut = () => {
    localStorage.setItem("auth-token", "");
    setUserData({ token: undefined, user: undefined });
    navigate("/login-email");
  };

  return (
    <div>
      {userData.user ? (
        <h1>Hellooooo {userData.user.firstName}, welcome </h1>
      ) : (
        <h1>Hello World</h1>
      )}

      <button onClick={logOut}>LOGOUT</button>
    </div>
  );
}
