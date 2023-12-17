// eslint-disable-next-line
import React from "react";
import NavigationBar from "./HomePageElements/NavigationBar";
import { useSelector } from "react-redux";
import TitleBar from "./HomePageElements/TitleBar";
import ImageUpload from "./HomePageElements/ImageHelper/ImageUpload";
// import Dashboards from "./HomePageElements/Dashboards";

export default function Home() {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const firstName = useSelector((state) => state.auth.user.firstName);

  return (
    <>
      {isAuth ? (
        <div>
          <TitleBar name={firstName} />
          <NavigationBar />
          <h1>Hello World </h1>
          <ImageUpload/>
        </div>
      ) : (
        <div>
          <TitleBar />
          {/* <Dashboards /> */}
          <h1>Hello World</h1>
        </div>
      )}
    </>
  );
}
