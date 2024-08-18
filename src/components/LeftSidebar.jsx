import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import {
  HomeOutlined as HomeIcon,
  BookmarkBorderOutlined,
  FavoriteBorderOutlined,
} from "@mui/icons-material";
import {
  Button,
  Grid,
  Hidden,
  IconButton,
  Input,
  Typography,
  useTheme,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { logout } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import Modal from "./Modal";
import { getPosts } from "../redux/postSlice";
import { addPost } from "../api";
import logo from "../logo.png";
import { th } from "date-fns/locale/th";

export default function LeftSidebar() {
  const theme = useTheme();

  const dispatch = useDispatch();
  const data = localStorage.getItem("login");
  const _id = data !== null ? JSON.parse(data)._id : null;

  const [openModal, setOpenModal] = React.useState(false);
  const [openLogout, setOpenLogout] = React.useState(false);
  const [opendPage, setOpendPage] = React.useState("home");
  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const [postText, setPostText] = React.useState("");
  const handleAddPost = async () => {
    const data = await addPost({ text: postText });
    if (data) {
      dispatch(getPosts());
      setPostText("");
    }
  };

  return (
    <>
      <Box sx={{ maxWidth: "100%" }}>
        <Box textAlign="center">
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              backgroundColor: "inherit",
            }}
          >
            <img src={logo} alt="logo" width="50px" />
          </Link>
        </Box>
        <List sx={{ marginTop: "50px", paddingRight: "20px" }}>
          <NavLink
            onClick={() => setOpendPage("home")}
            to="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              backgroundColor: "inherit",
            }}
          >
            <ListItem
              button
              sx={{
                borderRadius: "12px",
                margin: ".5rem 0",
                backgroundColor: opendPage == "home" ? "#fff" : "inherit",
                border: opendPage == "home" ? "0.5px solid #e5e5e5" : "none",
              }}
            >
              <ListItemIcon>
                <HomeIcon
                  fontSize="medium"
                  sx={{ color: opendPage == "home" ? "#000000" : "action" }}
                  // color={opendPage == "home" ? "primary" : "action"}
                />
              </ListItemIcon>
              <Hidden lgDown>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "18px",
                    color:
                      opendPage == "home"
                        ? "#000000"
                        : theme.palette.action.active,
                  }}
                  primary="Home"
                />
              </Hidden>
            </ListItem>
          </NavLink>
          <NavLink
            to={`/${_id}/saved-posts`}
            onClick={() => setOpendPage("saved")}
            style={{
              textDecoration: "none",
              color: "inherit",
              backgroundColor: "inherit",
            }}
          >
            <ListItem
              button
              sx={{
                borderRadius: "12px",
                margin: ".5rem 0",
                border: opendPage == "saved" ? "0.5px solid #e5e5e5" : "none",
                backgroundColor: opendPage == "saved" ? "#fff" : "inherit",
              }}
            >
              <ListItemIcon>
                <BookmarkBorderOutlined
                  sx={{ color: opendPage == "saved" ? "#000000" : "action" }}
                  fontSize="medium"
                  color="action"
                />
              </ListItemIcon>
              <Hidden lgDown>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "18px",
                    color:
                      opendPage == "saved"
                        ? "#000000"
                        : theme.palette.action.active,
                  }}
                  primary="Saved"
                />
              </Hidden>
            </ListItem>
          </NavLink>
          <NavLink
            onClick={() => setOpendPage("liked")}
            to={`/likedBy/${_id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              backgroundColor: "inherit",
            }}
          >
            <ListItem
              button
              sx={{
                borderRadius: "12px",
                margin: ".5rem 0",
                border: opendPage == "liked" ? "0.5px solid #e5e5e5" : "none",
                backgroundColor: opendPage == "liked" ? "#fff" : "inherit",
              }}
            >
              <ListItemIcon>
                <FavoriteBorderOutlined
                  sx={{ color: opendPage == "liked" ? "#000000" : "action" }}
                  fontSize="medium"
                  color="action"
                />
              </ListItemIcon>
              <Hidden lgDown>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "18px",
                    color:
                      opendPage == "liked"
                        ? "#000000"
                        : theme.palette.action.active,
                  }}
                  primary="Likes"
                />
              </Hidden>
            </ListItem>
          </NavLink>
          <NavLink
            onClick={() => setOpendPage("profile")}
            to={`/profile/${_id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              backgroundColor: "inherit",
            }}
          >
            <ListItem
              button
              sx={{
                borderRadius: "12px",
                margin: ".5rem 0",
                border: opendPage == "profile" ? "0.5px solid #e5e5e5" : "none",
                backgroundColor: opendPage == "profile" ? "#fff" : "inherit",
              }}
            >
              <ListItemIcon>
                <PersonOutlineIcon
                  sx={{ color: opendPage == "profile" ? "#000000" : "action" }}
                  fontSize="medium"
                  color="action"
                />
              </ListItemIcon>
              <Hidden lgDown>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "18px",
                    color:
                      opendPage == "profile"
                        ? "#000000"
                        : theme.palette.action.active,
                  }}
                  primary="Profile"
                />
              </Hidden>
            </ListItem>
          </NavLink>

          <ListItem
            id="basic-button"
            button
            sx={{
              borderRadius: "12px",
              margin: ".5rem 0",
            }}
            onClick={() => {
              setOpenLogout(true);
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="medium" color="action" />
            </ListItemIcon>
            <Hidden lgDown>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: "18px",
                  color: theme.palette.action.active,
                }}
                primary="Logout"
              />
            </Hidden>
          </ListItem>
        </List>
        <Hidden lgDown>
          <Button
            onClick={handleModalOpen}
            variant="contained"
            color="primary"
            fullWidth
            style={{
              width: "90%",
              borderRadius: "12px",
              padding: "10px",
              textTransform: "capitalize",
            }}
          >
            Post
          </Button>
        </Hidden>
        <Hidden lgUp>
          <IconButton
            onClick={handleModalOpen}
            variant="contained"
            color="primary"
            style={{
              borderRadius: "28px",
              padding: "0 15px",
              textTransform: "capitalize",
              textAlign: "center",
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Hidden>
      </Box>
      {openModal && (
        <Modal
          open={openModal}
          handleClose={handleModalClose}
          saveText={"Post"}
          len={postText.trimStart().length}
          handleSave={handleAddPost}
        >
          <Box>
            <Grid container>
              <Grid item>
                <img src={logo} alt="logo" width="60px" />
              </Grid>
              <Grid item flexGrow="1">
                <Box padding=".5rem 0">
                  <Input
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    multiline
                    rows="2"
                    disableUnderline
                    type="text"
                    placeholder="What's happening?"
                    sx={{ width: "100%" }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      )}
      {openLogout && (
        <Modal
          open={openLogout}
          maxWidth="xs"
          handleClose={() => setOpenLogout(false)}
          len={postText.trimStart().length}
          handleSave={handleAddPost}
        >
          <Box>
            <Typography>Are you sure you want to logout?</Typography>
            <Box
              sx={{ marginTop: "1rem" }}
              display="flex"
              // justifyContent="space-between"
            >
              <Button
                sx={{
                  color: "#1d7eca",
                  border: "1px solid #1d7eca",
                  borderRadius: "6px",
                  "&:hover": {
                    bgcolor: "#f0f0f0",
                  },
                }}
                onClick={() => {
                  dispatch(logout());
                  setOpenLogout(false);
                }}
              >
                Yes
              </Button>
              <Button
                sx={{
                  marginLeft: "1rem",
                  color: "#fff",
                  backgroundColor: "#1d7eca",
                  "&:hover": {
                    bgcolor: "#f0f0f0",
                  },
                }}
                onClick={() => setOpenLogout(false)}
              >
                No
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
}
