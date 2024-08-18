import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Dialog,
  Link,
  Typography,
  useTheme,
  DialogTitle,
  DialogContent,
  TextField,
} from "@mui/material";
import {
  CloseRounded,
  EditSharp,
  Person,
  Person2,
  Person3,
} from "@mui/icons-material";
import CToast from "../utils/components/Toast";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import DateRangeIcon from "@mui/icons-material/DateRange";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  editProfile,
  getProfile,
  getUserPosts,
  setFollow,
} from "../redux/authSlice";
import { Link as RouteLink } from "react-router-dom";
import { getFollowers, getFollowings } from "../redux/followSlice";

import {
  followAccount,
  followingAccount,
  unfollowAccount,
  unfollowingAccount,
} from "../api";
import format from "date-fns/format";

const ProfileImageUpload = ({ profile, handleFileChange, previewUrl }) => {
  return (
    <Box width={"100px"} position={"relative"} marginX={"auto"}>
      {previewUrl != null ? (
        <Box
          component={"img"}
          src={previewUrl}
          borderRadius={"50%"}
          marginRight={"10px"}
          alt="Selected"
          style={{ maxWidth: "100px", maxHeight: "100px" }}
        ></Box>
      ) : profile.image?.url ? (
        <img
          src={profile.image.url}
          alt="profile"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "100px",
          }}
        />
      ) : (
        <Person3
          sx={{
            // position: "relative",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            overflow: "hidden",
            backgroundColor: "#eee",
            margin: "0 auto",
          }}
          style={{ width: "100px", height: "100px" }}
        />
      )}
      <div>
        <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
          <EditSharp
            sx={{
              backgroundColor: "#eee",
              borderRadius: "50%",
              padding: "6px",
              border: "2px solid #fff",
              fontSize: "20px",
              position: "absolute",
              bottom: "0",
              right: "0",
            }}
          />
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }} // Hide the native file input element
        />
      </div>
    </Box>
  );
};

export default function Profile() {
  const theme = useTheme();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [editProfileData, setEditProfileData] = React.useState(null);
  const [followerCount, setFollowerCount] = React.useState(0);

  const { profile, status } = useSelector((state) => state.auth);
  const { posts, postStatus } = useSelector((state) => state.auth);
  const { followingStatus, followerStatus, followers, followings } =
    useSelector((state) => state.follow);
  const { _id } = JSON.parse(localStorage.getItem("login"));

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);

    const reader = new FileReader();

    reader.onload = () => {
      setPreviewUrl(reader.result);
    };

    reader.readAsDataURL(event.target.files[0]);
  };

  useEffect(() => {
    dispatch(getProfile(id));
    dispatch(getUserPosts(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (profile.id) {
      setFollowerCount(profile.followerCount);
      dispatch(getFollowers(profile.id));
      dispatch(getFollowings(profile.id));
    }
  }, [dispatch, profile.id]);

  const handleFollow = async () => {
    const responseFollow = await followAccount(profile.id);
    if (responseFollow) {
      console.log("rrrrrrrrrrrrr" + responseFollow);
      dispatch(setFollow(responseFollow));
      setFollowerCount(followerCount + 1);
    } else {
      CToast.error("Something went wrong");
    }
  };
  const handleUnfollow = async (id) => {
    const responseFollow = await unfollowAccount(id);
    if (responseFollow) {
      dispatch(setFollow(null));
      setFollowerCount(followerCount - 1);
    } else {
      CToast.error("Something went wrong");
    }
  };

  const setProfileData = (profile) => {
    setEditProfileData({
      fullName: profile?.fullName,
      username: profile?.username,
      bio: profile?.bio,
      image: profile?.image?.url,
    });

    console.log(editProfileData);
  };

  const editProfileHandler = async () => {
    const formData = new FormData();
    if (file !== null) {
      formData.append("image", file);
      console.log("file", file);
    }
    formData.append("id", _id);
    formData.append("fullName", editProfileData.fullName);
    formData.append("username", editProfileData.username);
    formData.append("bio", editProfileData.bio);
    console.log(formData.get("image"));

    const data = await editProfile(formData);
    if (data.status === 200) {
      dispatch(getProfile(id));
      setOpen(false);
    }
  };

  function hideFollow() {
    return _id === profile?.id;
  }

  function isFollowVisible() {
    if (followers) {
      const index = followers.findIndex(
        (follower) => follower.followerId === _id
      );
      if (index === -1) return true;
      return false;
    }
  }

  return (
    <Box>
      <Box
        sx={{
          boxShadow:
            "0px 1px 1px rgba(0, 0, 0, 0.05), 0px 1px 1px rgba(0, 0, 0, 0.05)",
          bgcolor: "#fff",
        }}
        padding="8px 20px"
      >
        <Grid container alignItems="center">
          <RouteLink to="/">
            <IconButton>
              <ArrowBackIcon />
            </IconButton>
          </RouteLink>

          <Typography
            sx={{
              marginLeft: "10px",
              fontSize: "16px",
              color: "#000",
              fontWeight: 600,
            }}
          >
            Profile
          </Typography>
        </Grid>
      </Box>
      <Box textAlign="center">
        {status === "loading" && (
          <Box marginTop="1rem">
            <CircularProgress size={20} color="primary" />
          </Box>
        )}
      </Box>
      {status === "success" && (
        <Box
          height="90vh"
          sx={{
            overflowY: "scroll",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Box position="relative">
            <img
              width="100%"
              src={
                profile?.backgroundImageUrl ??
                "https://th.bing.com/th/id/R.ead9522a58f97498336fbf7a3e4266cb?rik=849eeKFbuN2kkg&pid=ImgRaw&r=0"
              }
              alt="background"
            />
            <Box
              sx={{
                position: "absolute",
                top: 105,
                left: 15,
                background: "#eee",
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              <img
                width="150px"
                style={{
                  borderRadius: "50%",
                }}
                height={"150px"}
                src={
                  profile?.image?.url ||
                  "https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png"
                }
                alt="profile"
              />
            </Box>
          </Box>
          <Box textAlign="right" padding="10px 20px">
            <IconButton>
              <MoreHorizIcon />
            </IconButton>
            <IconButton>
              <MailOutlineIcon />
            </IconButton>
            {!hideFollow() &&
              isFollowVisible() &&
              (profile?.follow != null ? (
                <Button
                  onClick={() => handleUnfollow(profile?.follow?.id)}
                  size="small"
                  sx={{
                    borderRadius: theme.shape.borderRadius,
                    textTransform: "capitalize",
                    padding: "6px 20px",
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
                    padding: "6px 20px",
                    background: "black",
                    "&:hover": {
                      background: "#333",
                    },
                  }}
                  variant="contained"
                >
                  Follow
                </Button>
              ))}

            {!hideFollow() && !isFollowVisible() && (
              <Button
                onClick={handleUnfollow}
                size="small"
                sx={{
                  borderRadius: theme.shape.borderRadius,
                  textTransform: "capitalize",
                  padding: "6px 20px",
                  background: "black",
                  "&:hover": {
                    background: "#333",
                  },
                }}
                variant="contained"
              >
                Unfollow
              </Button>
            )}
            {_id === profile.id && (
              <Button
                onClick={() => {
                  setProfileData(profile);
                  setOpen(true);
                }}
                size="small"
                sx={{
                  borderRadius: theme.shape.borderRadius,
                  textTransform: "capitalize",
                  padding: "6px 20px",
                  background: "black",
                  "&:hover": {
                    background: "#333",
                  },
                }}
                variant="contained"
              >
                Edit
              </Button>
            )}
          </Box>
          <Box padding="10px 20px">
            <Typography variant="h6" sx={{ fontWeight: "500" }}>
              {profile?.fullName}
            </Typography>
            <Typography sx={{ fontSize: "14px", color: "#555" }}>
              @{profile?.username}
            </Typography>
            <Typography fontSize="16px" color="#333" padding="10px 0">
              {profile.bio}
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              padding="6px 0"
              flexWrap="wrap"
            >
              <Box display="flex">
                <LocationOnIcon htmlColor="#555" />
                <Typography sx={{ ml: "6px", color: "#555" }}>
                  {profile.location}
                </Typography>
              </Box>
              <Box display="flex" marginLeft="1rem">
                <InsertLinkIcon htmlColor="#555" />
                <Link
                  sx={{ textDecoration: "none", marginLeft: "6px" }}
                  href={profile.website || "https:/wasifbaliyan.com"}
                >
                  {profile.website ? profile.website : "www"}
                </Link>
              </Box>
              <Box display="flex" marginLeft="1rem">
                <DateRangeIcon htmlColor="#555" />
                <Typography sx={{ ml: "6px", color: "#555" }}>
                  {profile?.createdAt &&
                    format(new Date(profile.createdAt), "MMM dd yyyy")}
                </Typography>
              </Box>
            </Box>
            <Box display="flex">
              <Typography color="#555" marginRight="1rem">
                <strong style={{ color: "black", marginRight: "0.5rem" }}>
                  {profile?.followingCount}
                </strong>
                Following
              </Typography>
              <Typography color="#555" marginRight="1rem">
                <strong style={{ color: "black", marginRight: "0.5rem" }}>
                  {followerCount}
                </strong>
                Followers
              </Typography>
            </Box>
          </Box>
          <Box borderBottom="1px solid #ccc">
            <Typography
              display="inline-block"
              variant="caption"
              fontSize="16px"
              marginX="1rem"
              padding="6px 0"
              fontWeight="500"
              borderBottom={`4px solid ${theme.palette.primary.main}`}
            >
              Posts
            </Typography>
          </Box>
          {posts &&
            posts.map((post) => (
              <Post key={post._id} post={post} profile={true} />
            ))}
          {posts?.length === 0 && (
            <Box textAlign="center" padding="20px">
              <Typography variant="h6">No Posts</Typography>
            </Box>
          )}
        </Box>
      )}
      <Dialog
        open={open}
        onClose={() => {
          setProfileData();
          setOpen(false);
        }}
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box maxWidth={"700px"} minWidth={"500px"}>
            <from
              onSubmit={() => {
                setOpen(true);
                editProfileHandler();
              }}
            >
              <ProfileImageUpload
                profile={profile}
                previewUrl={previewUrl}
                handleFileChange={handleFileChange}
              />
              <Typography>Username</Typography>
              <TextField
                onChange={(e) =>
                  setEditProfileData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                name="username"
                value={editProfileData?.username}
                sx={{ width: "100%", margin: "1rem 0", bgcolor: "#fff" }}
                variant="outlined"
                label="Enter full name"
                type="text"
                required
              />

              <Typography>FullName</Typography>
              <TextField
                onChange={(e) =>
                  setEditProfileData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                name="fullName"
                value={editProfileData?.fullName}
                sx={{ width: "100%", margin: "1rem 0", bgcolor: "#fff" }}
                variant="outlined"
                label="Enter full name"
                type="text"
                required
              />
              <Typography>Bio</Typography>
              <TextField
                onChange={(e) =>
                  setEditProfileData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                name="bio"
                sx={{ width: "100%", margin: "1rem 0", bgcolor: "#fff" }}
                variant="outlined"
                value={editProfileData?.bio}
                label="Enter Bio"
                type="text"
                required
              />
              <Button
                disabled={
                  editProfileData?.username?.trimStart().length === 0 ||
                  editProfileData?.fullName?.trimStart().length === 0
                }
                onClick={editProfileHandler}
                type="submit"
                sx={{
                  width: "100%",
                  margin: "1.5rem 0",
                  padding: "12px 0",
                  borderRadius: "28px",
                }}
                variant="contained"
                color="primary"
              >
                Edit Profile
              </Button>
            </from>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
