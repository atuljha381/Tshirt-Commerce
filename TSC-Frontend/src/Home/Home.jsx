// eslint-disable-next-line
import React from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./HomePageElements/NavigationBar";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../slices/authSlice";

export default function Home() {
  const navigate = useNavigate();
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const firstName = useSelector((state) => state.auth.user.firstName);
  const dispatch = useDispatch();
  const logOut = () => {
    dispatch(authActions.logout);
    navigate("/login-email");
  };

  return (
    <>
      {isAuth ? (
        <div>
          <NavigationBar />
          <h1>Hello World {firstName}</h1>
        </div>
      ) : (
        <h1>Hello World {firstName}</h1>
      )}

      <button onClick={logOut}>LOGOUT</button>
    </>
  );
}
