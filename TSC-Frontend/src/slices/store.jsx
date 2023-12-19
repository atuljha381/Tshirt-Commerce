import { configureStore } from "@reduxjs/toolkit";
import messageSlice from "./messageSlice";
import authSlice from "./authSlice";
const store = configureStore({
  reducer: { message: messageSlice.reducer, auth: authSlice.reducer },
});

export default store;
