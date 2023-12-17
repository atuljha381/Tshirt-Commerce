import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  createTheme,
  IconButton,
  Menu,
  MenuItem,
  ThemeProvider,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AccountCircle, LoginRounded } from "@mui/icons-material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme({ palette: { mode: "dark" } });

export default function TitleBar(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const auth = useSelector((state) => state.auth.isAuthenticated);

  const handleLogOut = (event) => {
    event.preventDefault();
    if (auth) {
      dispatch(authActions.logout());
      navigate("/login-email");
    }
  };

  const handleLogIn = (event) => {
    event.preventDefault();
    navigate("/login-email");
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {props.name}
            </Typography>
            {auth && (
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ mr: 4 }}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                </Menu>
              </div>
            )}
            {!auth && (
              <div>
                <IconButton
                  size="large"
                  aria-label="take user to login page"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleLogIn}
                  color="inherit"
                >
                  <LoginRounded />
                </IconButton>
              </div>
            )}
            <IconButton
              size="large"
              aria-label="shopping cart"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              sx={{ mr: 2 }}
            >
              <ShoppingCartIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}
