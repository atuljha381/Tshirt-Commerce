import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../contexts/userContext";
import axios from "axios";
import {
  createTheme,
  Typography,
  ThemeProvider,
  Container,
  CssBaseline,
  Box,
  Avatar,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  Alert
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit">
        <RouterLink to={"/home"}>Your Website</RouterLink>
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme({ palette: { mode: "dark" } });

export default function LoginViaMail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // eslint-disable-next-line
  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  let token = localStorage.getItem("auth-token");
  useEffect(() => {
    if (token) {
      try {
        <Alert severity="success">This is a success message!</Alert>;
        navigate("/home");
      } catch (error) {
        console.error("Error navigating to /home:", error);
      }
    }
  });

  const loginToUser = async (event) => {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      setEmail(data.get("email"));
      setPassword(data.get("password"));
      const loginCredentials = { email, password };
      const loginResponse = await axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/auth/login-email`,
          loginCredentials
        )
        .catch((error) => {
          alert(error);
        });

      setUserData({
        token: loginResponse.token,
        user: loginResponse.data.user,
      });

      localStorage.setItem("auth-token", userData.token);
      <Alert severity="success">This is a success message!</Alert>;
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={loginToUser}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link variant="body2">
                  <RouterLink to={"/signup-email"}>
                    Don't have an account? Sign Up
                  </RouterLink>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
