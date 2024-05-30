import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Modal,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../slices/authSlice";
import { loginHandler } from "../../services/authentication";

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

export default function LoginViaMail({ isOpen, onRequestClose }) {
  const dispatch = useDispatch();
  // const firstName = useSelector(state => state.auth.firstName)
  const navigate = useNavigate();
  const loginToUser = async (event) => {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      const email = data.get("email");
      const password = data.get("password");
      const loginResponse = await loginHandler(email, password);
      dispatch(authActions.login(loginResponse.data));
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Modal open={isOpen} onClose={onRequestClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
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
      </Box>
    </Modal>
  );
}
