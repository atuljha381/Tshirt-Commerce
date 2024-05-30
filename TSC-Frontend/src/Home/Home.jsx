// eslint-disable-next-line
import React from "react";
import NavigationBar from "./HomePageElements/NavigationBar";
import { useSelector } from "react-redux";
import TitleBar from "./HomePageElements/TitleBar";
import ImageUpload from "./ImageDesigner/ImageUpload";
import ImageCarousel from "./ImageDesigner/ImageCarousel";
import Dashboards from "./HomePageElements/Dashboards";
// import Dashboards from "./HomePageElements/Dashboards";

export default function Home() {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const firstName = useSelector((state) => state.auth.user.firstName);

  return (
    <>
      {isAuth ? (
        <div>
          <NavigationBar name={firstName} />
          <h1>Hello World </h1>
        </div>
      ) : (
        <div>
          {/* <TitleBar /> */}
          <NavigationBar />

          <h1>Hello World</h1>
          <ImageUpload />
          <Dashboards />
          <ImageCarousel />
        </div>
      )}
    </>
  );
}
