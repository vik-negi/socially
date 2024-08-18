import { Typography, useTheme } from "@mui/material";
import { Button, Grid } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { followAccount, unfollowAccount } from "../api";
import { getFollowers, getFollowings } from "../redux/followSlice";
import { defaultProfile } from "../utils/constants";
import CToast from "../utils/components/Toast";

export default function WhoToFollow({ userr }) {
  const theme = useTheme();
  const { _id } = JSON.parse(localStorage.getItem("login"));

  const [user, setUser] = React.useState(userr);

  const handleFollow = async () => {
    const responseFollow = await followAccount(user.id);
    if (responseFollow) {
      setUser((prev) => ({
        ...prev,
        follow: responseFollow,
        followerCount: prev?.followerCount + 1,
      }));
    } else {
      CToast.error("Something went wrong");
    }
  };
  const handleUnfollow = async (id) => {
    const responseFollow = await unfollowAccount(id);
    if (responseFollow) {
      setUser((prev) => ({
        ...prev,
        follow: null,
        followerCount: prev?.followerCount - 1,
      }));
    } else {
      CToast.error("Something went wrong");
    }
  };
  return (
    <Box
      sx={{
        padding: "12px 16px",
        border: "1px solid #ddd",
        borderRadius: "12px",
      }}
      borderRadius={theme.shape.borderRadius}
      margin="1rem 0"
    >
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Grid container>
            <Link to={`/profile/${user.id}`}>
              <Grid item sx={{ paddingRight: "12px" }}>
                <img
                  style={{ borderRadius: "12px" }}
                  src={user?.image?.url || defaultProfile}
                  width="50px"
                  alt="logo"
                />
              </Grid>
            </Link>
            <Grid item>
              <Grid container alignItems="center">
                <Grid item>
                  <Typography sx={{ fontSize: "16px", fontWeight: "500" }}>
                    {user.fullName}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Typography
                      sx={{ fontSize: "14px", mr: "6px", color: "#555" }}
                    >
                      {user.username}
                    </Typography>
                    {/* <Typography
                      sx={{
                        fontSize: "12px",
                        background: "#ccc",
                        borderRadius: theme.shape.borderRadius,
                        padding: "0 6px",
                        color: "#777",
                      }}
                    >
                      follows you
                    </Typography> */}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          {user?.follow != null ? (
            <Button
              onClick={() => handleUnfollow(user?.follow?.id)}
              size="small"
              sx={{
                borderRadius: theme.shape.borderRadius,
                textTransform: "capitalize",
                ml: "12px",
                background: "black",
                "&:hover": {
                  background: "#333",
                },
              }}
              variant="contained"
            >
              Following
            </Button>
          ) : (
            <Button
              onClick={handleFollow}
              size="small"
              sx={{
                borderRadius: theme.shape.borderRadius,
                textTransform: "capitalize",
                ml: "12px",
                background: "black",
                "&:hover": {
                  background: "#333",
                },
              }}
              variant="contained"
            >
              Follow
            </Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
