import { Button } from "@mui/material";
import React from "react";

const Confirmation = ({ prevStep, nextStep, values }) => {
  const Next = (e) => {
    e.preventDefault();
    nextStep();
  };
  const Previous = (e) => {
    e.preventDefault();
    prevStep();
  };
  return (
    <div>
      <Button variant="contained" onClick={Previous}>
        Back
      </Button>
      <Button variant="contained" onClick={Next}>
        Confirm
      </Button>
    </div>
  );
};
export default Confirmation;
