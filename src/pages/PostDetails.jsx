import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Input,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import format from "date-fns/format";
import Carousel from "react-material-ui-carousel";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SyncIcon from "@mui/icons-material/Sync";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import IosShareIcon from "@mui/icons-material/IosShare";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  getComments,
  getPostDetails,
  updatePostDetailsLike,
} from "../redux/postSlice";
import { updateComment } from "../redux/postSlice";
import { addComment, deletePost, DislikePost, likePost } from "../api";
import Comment from "../components/Comment";
import logo from "../logo.png";
import { defaultProfile } from "../utils/constants";
import { parseStyledText } from "../utils/text_parser";

export default function PostDetails() {
  const [commentText, setCommentText] = useState("");
  const theme = useTheme();
  const { id } = useParams();
  const history = useNavigate();
  const dispatch = useDispatch();
  const { status, comments, commentStatus, postDetails } = useSelector(
    (state) => state.post
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [parentCommentId, setParentCommentId] = useState(null);
  const open = Boolean(anchorEl);

  const handleShare = async (title, text, url) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title, // The title of the post
          text: text, // The description or text of the post
          url: url,
        });
        console.log("Post shared successfully");
      } catch (error) {
        console.error("Error sharing post:", error);
      }
    } else {
      console.warn("Share API not supported on this browser");
      // Fallback option: You can implement copy-to-clipboard or other sharing mechanisms
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { _id } = JSON.parse(localStorage.getItem("login"));
  const handleDeletePost = async () => {
    const response = await deletePost(postDetails.id);
    if (response) {
      history.go(0);
    }
  };

  const handleLike = async (liked) => {
    console.log("handleLike", liked);
    const response = !liked
      ? await likePost(postDetails.id)
      : await DislikePost(postDetails.id);
    if (response) {
      dispatch(updatePostDetailsLike());
    } else {
    }
  };

  useEffect(() => {
    dispatch(getPostDetails(id));
    dispatch(getComments(id));
  }, [dispatch, id]);

  const handleReply = (parentId, username) => {
    console.log(parentId, username);
    setCommentText(`@${username} `);
    setParentCommentId(parentId);
  };

  const handleAddComment = async () => {
    const response = await addComment({
      postId: parseInt(id, 10),
      parentcommentId:
        parentCommentId == null ? null : parseInt(parentCommentId),
      content: commentText,
    });
    if (response) {
      dispatch(
        updateComment({
          add: true,
          comment: response,
        })
      );
      setCommentText("");
    }
    setParentCommentId(null);
  };

  return (
    <Box>
      <Box borderBottom="1px solid #ccc" padding="8px 20px">
        <Grid container alignItems="center">
          <Grid item sx={{ mr: "10px" }}>
            <IconButton onClick={() => history(-1)}>
              <ArrowBackIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <Typography variant="h6">Post</Typography>
          </Grid>
        </Grid>
      </Box>
      <Box
        height="92vh"
        sx={{
          overflowY: "scroll",
          scrollbarWidth: "0",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Box textAlign="center" marginTop="1rem">
          {status === "loading" && (
            <CircularProgress size={20} color="primary" />
          )}
        </Box>
        {status === "success" && (
          <Box padding="0 20px">
            <Box>
              <Grid container alignItems="center">
                <Grid item flexGrow="1">
                  <Grid container justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                      <img
                        src={
                          postDetails.createdBy?.image?.url || defaultProfile
                        }
                        style={{ borderRadius: "12px" }}
                        alt="lgogo"
                        width="60px"
                      />
                      <Box padding="0 1rem">
                        <Typography
                          sx={{ fontSize: "16px", fontWeight: "500" }}
                        >
                          {postDetails.createdBy &&
                            postDetails.createdBy.username}
                        </Typography>
                        <Typography sx={{ fontSize: "15px", color: "#555" }}>
                          @
                          {postDetails.createdBy?.username &&
                            postDetails.createdBy?.fullName}
                        </Typography>
                      </Box>
                    </Box>
                    <Grid item marginTop={"20px"}>
                      <Box>
                        <Typography sx={{ fontSize: "15px", color: "#555" }}>
                          {postDetails?.description &&
                            parseStyledText(postDetails.description)}
                        </Typography>
                      </Box>
                      {postDetails.images?.length > 0 && (
                        <Carousel sx={{ height: "auto" }} marginTop=".5rem">
                          {postDetails.images.map((image, index) => (
                            <img
                              src={image?.url}
                              alt="post"
                              width="100%"
                              key={index}
                            />
                          ))}
                        </Carousel>
                      )}
                    </Grid>
                    <Grid item>
                      {status === "success" &&
                        postDetails.createdBy &&
                        _id === postDetails.createdBy.id && (
                          <IconButton
                            aria-expanded={open ? "true" : undefined}
                            onClick={(e) => {
                              e.preventDefault();
                              handleClick(e);
                            }}
                          >
                            <MoreHorizIcon />
                          </IconButton>
                        )}

                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeletePost();
                          }}
                        >
                          Delete Post
                        </MenuItem>
                      </Menu>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            <Box></Box>
            <Box display="flex" padding="1rem 0" borderBottom="1px solid #ccc">
              <Typography sx={{ fontSize: "14px", mr: "6px", color: "#555" }}>
                {postDetails &&
                  postDetails.createdAt &&
                  format(new Date(postDetails.createdAt), "HH:mm a")}
              </Typography>
              <Typography sx={{ fontSize: "14px", mr: "6px", color: "#555" }}>
                .
              </Typography>
              <Typography sx={{ fontSize: "14px", mr: "6px", color: "#555" }}>
                {postDetails &&
                  postDetails.createdAt &&
                  format(new Date(postDetails.createdAt), "MMM dd yyyy")}
              </Typography>
            </Box>
            <Box display="flex" padding="1rem 0" borderBottom="1px solid #ccc">
              <Typography sx={{ fontSize: "14px", mr: "6px", color: "#555" }}>
                <strong>{postDetails?.likeCount}</strong> Likes
              </Typography>
              <Typography sx={{ fontSize: "14px", mr: "6px", color: "#555" }}>
                <strong>{postDetails?.commentCount}</strong> Comments
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-around"
              padding=".5rem 0"
              borderBottom="1px solid #ccc"
            >
              <IconButton
                style={{
                  borderRadius: "10px",
                }}
                size="medium"
              >
                <ChatBubbleOutlineIcon fontSize="medium" />
                <Typography
                  sx={{
                    marginLeft: ".5rem",
                    fontSize: "16px",
                    fontWeight: 500,
                    color: "#111",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Comment
                </Typography>
              </IconButton>
              <IconButton
                style={{
                  borderRadius: "10px",
                }}
                size="medium"
              >
                <SyncIcon fontSize="medium" />
              </IconButton>

              <IconButton
                style={{
                  borderRadius: "10px",
                }}
                onClick={() => handleLike(postDetails.liked)}
                size="medium"
              >
                {postDetails.liked ? (
                  <FavoriteIcon
                    fontSize="medium"
                    style={{
                      color: "#E94C4C",
                    }}
                  />
                ) : (
                  <FavoriteBorderIcon fontSize="medium" />
                )}
                <Typography
                  sx={{
                    marginLeft: ".5rem",
                    fontSize: "15px",
                    color: "#555",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {postDetails?.likeCount ?? 0}
                </Typography>
              </IconButton>

              <IconButton
                style={{
                  borderRadius: "10px",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleShare(
                    "Hey! Check out this post",
                    postDetails.description,
                    `http:localhost:3000/posts/${postDetails.id}`
                  );
                }}
              >
                <IosShareIcon fontSize="medium" />
                <Typography
                  sx={{
                    marginLeft: ".5rem",
                    fontSize: "16px",
                    fontWeight: 500,
                    color: "#111",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Share
                </Typography>
              </IconButton>
            </Box>
            <Box>
              <Grid
                container
                sx={{
                  background: "#f9f9f9",
                  marginTop: "1rem",
                  borderRadius: theme.shape.borderRadius,
                  padding: "1rem",
                }}
              >
                <Grid item marginRight={"10px"}>
                  <img src={defaultProfile} alt="logo" width="60px" />
                </Grid>
                <Grid item flexGrow="1">
                  <Box padding=".5rem 0">
                    <Input
                      onChange={(e) => setCommentText(e.target.value)}
                      value={commentText}
                      multiline
                      rows="2"
                      disableUnderline
                      type="text"
                      placeholder="Post your comment"
                      sx={{ width: "100%" }}
                    />
                  </Box>
                  <Box textAlign="right" paddingBottom=".5rem">
                    <Button
                      disabled={commentText.length === 0}
                      onClick={handleAddComment}
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{
                        borderRadius: theme.shape.borderRadius,
                        fontSize: "12px",
                      }}
                    >
                      Comment
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              <Box textAlign="center" marginTop="1rem">
                {commentStatus === "loading" && (
                  <CircularProgress size={20} color="primary" />
                )}
              </Box>
              <Box
                sx={{
                  border: "1px solid #e1e1e1",
                  borderRadius: theme.shape.borderRadius,
                  height: "72vh",
                  overflowY: "scroll",
                  marginTop: "1rem",
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                {commentStatus === "success" &&
                  comments != null &&
                  comments.map((comment) => (
                    <Comment
                      key={comment.id}
                      comment={comment}
                      handleReply={(parentId, username) =>
                        handleReply(parentId, username)
                      }
                    />
                  ))}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
