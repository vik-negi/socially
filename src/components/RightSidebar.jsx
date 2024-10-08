import { Search } from "@mui/icons-material";
import { Input, Typography, Grid, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import WhoToFollow from "./WhoToFollow";
import { Link } from "react-router-dom";
import { getFollowings } from "../redux/followSlice";

export default function RightSidebar() {
  const [query, setQuery] = React.useState("");
  const { _id } = JSON.parse(localStorage.getItem("login"));
  const dispatch = useDispatch();
  const { users, userStatus } = useSelector((state) => state.auth);
  const { followingStatus, followings } = useSelector((state) => state.follow);
  function queriedUsers() {
    return users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
    );
  }

  useEffect(() => {
    dispatch(getFollowings(_id));
  }, [dispatch, _id]);

  function showToFollow() {
    const filtered = users.filter((user) => user._id !== _id);

    return filtered.filter((item) => {
      const index = followings.findIndex(
        (follow) => follow.followingId === item._id
      );
      if (index !== -1) {
        return false;
      }
      return true;
    });
  }

  return (
    <Box sx={{ height: "100%" }}>
      <Box paddingTop="10px">
        <Box
          width="100%"
          borderRadius="28px"
          border="1px solid #eee"
          position="relative"
          sx={{
            background: "#fff",
          }}
        >
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            inputProps={{
              style: { padding: "10px" },
            }}
            disableUnderline
            fullWidth
            placeholder="Search"
            startAdornment={
              <Search
                sx={{
                  paddingLeft: "20px",
                  color: "#777",
                }}
              />
            }
          />
          {query.length !== 0 && (
            <Box
              width="100%"
              sx={{
                marginTop: "10px",
                backgroundColor: "white",
                border: "1px solid #eee",
                borderRadius: "28px",
                zIndex: "999",
                maxHeight: "50vh",
                overflowY: "scroll",
                scrollbarWidth: "0",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
              position="absolute"
            >
              {query.length !== 0 && queriedUsers().length === 0 && (
                <Typography sx={{ padding: "0 1rem" }}>
                  No users found!
                </Typography>
              )}
              {queriedUsers().map((user) => (
                <Box margin={".5rem"} key={user.id}>
                  <Link
                    onClick={() => setQuery("")}
                    style={{ textDecoration: "none" }}
                    to={`/profile/${user.id}`}
                  >
                    <Grid
                      sx={{
                        borderRadius: "12px",
                        overflow: "hidden",
                        padding: ".2rem 1rem",
                        "&:hover": {
                          backgroundColor: "#eee",
                        },
                      }}
                      container
                      alignItems="center"
                    >
                      <Grid item sx={{ paddingRight: "12px" }}>
                        <img
                          style={{ borderRadius: "12px" }}
                          src={
                            user?.image?.url ||
                            "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
                          }
                          width="50px"
                          alt="logo"
                        />
                      </Grid>
                      <Grid item>
                        <Grid container alignItems="center">
                          <Grid item>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontWeight: "500",
                                color: "#000",
                              }}
                            >
                              {user.fullName}
                            </Typography>
                            <Box display="flex" alignItems="center">
                              <Typography
                                sx={{
                                  fontSize: "14px",
                                  mr: "6px",
                                  color: "#555",
                                }}
                              >
                                {user.username}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Link>
                </Box>
              ))}
            </Box>
          )}
        </Box>
        <Box
          sx={{
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "28px",
            padding: "20px 20px 10px 20px",
            margin: "1rem 0",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Who to follow
          </Typography>
          <Box textAlign="center" marginTop="1rem">
            {(userStatus === "loading" || followingStatus === "loading") && (
              <CircularProgress size={20} color="primary" />
            )}
          </Box>
          <Box
            sx={{
              height: showToFollow().length > 7 ? "72vh" : "80vh",
              overflowY: "scroll",
              scrollbarWidth: "1px",
              scrollbarColor: "#000",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {userStatus === "success" &&
              showToFollow().map((item) => (
                <WhoToFollow key={item.id} userr={item} />
              ))}
          </Box>
          <Box textAlign="center" marginTop="1rem">
            {showToFollow().length > 7 && (
              <Typography>
                <Link to="/users" style={{ textDecoration: "none" }}>
                  Show more
                </Link>
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
