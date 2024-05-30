import React from "react";
import LoginViaMail from "../../RegisterViaMail/Login Page/LoginViaMail";

export default function Dashboards() {
  const [modalIsOpen, setModalIsOpen] = React.useState(false);

  const closeModal = () => {
    setModalIsOpen(false);
    console.log(modalIsOpen);
  };
  const openModal = () => {
    setModalIsOpen(true);
    console.log(modalIsOpen);
  };

  return (
    <div>
      <h1>Hello World</h1>
      {/* <button onClick={openModal}>Login</button>
      <LoginViaMail isOpen={modalIsOpen} onRequestClose={closeModal} /> */}
    </div>
  );
}
