import { Alert } from "@mui/material";
import React from "react";

export default function Notification(props) {
  let alertType = "";
  if (props.status == "error") {
    alertType = "error";
  }
  if (props.status == "success") {
    alertType = "success";
  }
  if (props.status == "info") {
    alertType = "info";
  }
  if (props.status == "warning") {
    alertType = "warning";
  }
  return (
    <section>
      <Alert severity={alertType}></Alert>
    </section>
  );
}
