import { Button, TextField } from "@mui/material";
import React from "react";

const PersonalDetails = ({ prevStep, nextStep, handleChange, values }) => {
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
      <form>
        <Button variant="contained" onClick={Previous}>
          Back
        </Button>
        <TextField
          placeholder="Full Name"
          label="Full Name"
          onChange={handleChange("fullName")}
          defaultValue={values.fullName}
        />
        <Button variant="contained" onClick={Next}>
          Next
        </Button>
      </form>
    </div>
  );
};
export default PersonalDetails;
