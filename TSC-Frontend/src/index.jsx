import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./slices/store";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDpLsUlZ3UNKbjOHalpi_J4gLQomgbIbQ",
  authDomain: "tshirt-commerce-fe5b0.firebaseapp.com",
  projectId: "tshirt-commerce-fe5b0",
  storageBucket: "tshirt-commerce-fe5b0.appspot.com",
  messagingSenderId: "904994058126",
  appId: "1:904994058126:web:79805778aa3bd015dfbedf",
  measurementId: "G-2MERDX8LE1"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
