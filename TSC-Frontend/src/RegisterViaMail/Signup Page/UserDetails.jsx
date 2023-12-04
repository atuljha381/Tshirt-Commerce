import { Button, TextField } from "@mui/material";
import React from "react";

const UserDetails = ({ nextStep, handleChange, values }) => {
  const Next = (e) => {
    e.preventDefault();
    console.log(
      "User Detail Page it is, on to Personal Details: ",
      values.step
    );
    nextStep();
  };
  return (
    <div>
      <form>
        <TextField
          placeholder="Email Address"
          label="Email Address"
          onChange={handleChange("email")}
          defaultValue={values.email}
        />
        <Button variant="contained" onClick={Next}>
          Next
        </Button>
      </form>
    </div>
  );
};

export default UserDetails;
