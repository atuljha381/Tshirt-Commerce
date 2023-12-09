import axios from "axios";

export const loginHandler = async (email, password) => {
  const credentials = { email, password };
  const response = await axios
    .post(`${process.env.REACT_APP_BACKEND_URL}/auth/login-email`, credentials)
    .catch((err) => {
      alert(err);
    });

  if (!response.data) {
    alert("Oh! Some error occured");
  }
  return response;
};
export const signupHandler = async (
  firstName,
  lastName,
  phone,
  email,
  password
) => {
  const credentials = { firstName, lastName, phone, email, password };
  const response = await axios
    .post(`${process.env.REACT_APP_BACKEND_URL}/auth/signup-email`, credentials)
    .catch((error) => {
      alert(error);
    });
  return response;
};
