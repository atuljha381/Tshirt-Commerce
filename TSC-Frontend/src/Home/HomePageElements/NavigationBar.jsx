import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  createTheme,
  IconButton,
  ThemeProvider,
} from "@mui/material";
import { List } from "@mui/icons-material";
import React from "react";

const defaultTheme = createTheme({ palette: { mode: "dark" } });
export default function NavigationBar(props) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <List />
              <Typography variant="h6" component="div" sx={{ flexGrow: 2 }}>
                All
              </Typography>
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}
