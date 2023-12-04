import React, { useState } from "react";
import UserDetails from "./UserDetails";
import PersonalDetails from "./PersonalDetails";
import Confirmation from "./Confirmation";
import Success from "./Success";

export default function SignupViaMail() {
  const [data, setData] = useState({
    step: 1,
    email: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
  });

  const prevStep = () => {
    setData({ step: data.step - 1 });
  };

  const nextStep = () => {
    setData({ step: data.step + 1 });
  };

  const handleChange = (input) => (e) => {
    setData((prevData) => ({ ...prevData, [input]: e.target.value }));
  };

  const { step } = data;
  const { email, fullName, phoneNumber, address, state, city, pincode } = data;
  const values = {
    email,
    fullName,
    phoneNumber,
    address,
    state,
    city,
    pincode,
  };

  switch (step) {
    case 1:
      return (
        <UserDetails
          nextStep={nextStep}
          handleChange={handleChange}
          values={values}
        />
      );

    case 2:
      return (
        <PersonalDetails
          prevStep={prevStep}
          nextStep={nextStep}
          handleChange={handleChange}
          values={values}
        />
      );

    case 3:
      return (
        <Confirmation prevStep={prevStep} nextStep={nextStep} values={values} />
      );

    case 4:
      return <Success />;

    default:
  }
}
