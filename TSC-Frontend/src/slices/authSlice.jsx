import { createSlice } from "@reduxjs/toolkit";
import { messageActions } from "./messageSlice";

const initialAuthState = {
  isAuthenticated: false,
  token: "",
  user: { firstName: "", lastName: "", phone: "", email: "" },
};

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      messageActions.setMessage("Loged In Successfully");
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = "";
      state.user = "";
      messageActions.setMessage("Loged Out Successfully");
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;
