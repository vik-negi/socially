import React, { useEffect } from "react";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Box from "@mui/material/Box";
import { Grid, Hidden } from "@mui/material";
import { useTheme } from "@mui/system";
import { getUsers } from "../redux/authSlice";
import { useDispatch } from "react-redux";

export default function Layout({ children }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = localStorage.getItem("login");
  const _id = user !== null ? JSON.parse(user)._id : null;

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
  return (
    <Box
      bgcolor={"#eff0f4"}
      sx={{
        padding: "1rem",
        // maxWidth: theme.breakpoints.values.lg,
        // maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <Grid container>
        <Grid
          item
          xs={1}
          lg={1.75}
          style={{
            borderRight: "1px solid #e1e1e1",
          }}
        >
          <LeftSidebar />
        </Grid>
        <Grid item xs={11} lg={10.25}>
          <Grid container>
            <Grid item xs={12} lg={8}>
              <Box
                maxWidth={"600px"}
                margin={"0 auto"}
                sx={{
                  height: "100vh",
                }}
              >
                {children}
              </Box>
            </Grid>
            <Hidden lgDown>
              <Grid item lg={4} sx={{ height: "100vh" }}>
                <RightSidebar />
              </Grid>
            </Hidden>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
