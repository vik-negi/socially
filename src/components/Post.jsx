import {
  Grid,
  IconButton,
  Input,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";

import { Box } from "@mui/system";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import Carousel from "react-material-ui-carousel";
import React, { useEffect, useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SyncIcon from "@mui/icons-material/Sync";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import { Link } from "react-router-dom";
import {
  addComment,
  deletePost,
  DislikePost,
  getProductRelatedToPost,
  likePost,
  savePost,
  unSavePost,
} from "../api";
import { useDispatch } from "react-redux";
import { getPosts, updateLike } from "../redux/postSlice";
import Modal from "./Modal";
import { getProfile } from "../redux/authSlice";
import logo from "../logo.png";
import { defaultProfile } from "../utils/constants";
import { MoreVert } from "@mui/icons-material";
import CToast from "../utils/components/Toast";
import { parseStyledText } from "../utils/text_parser";
import RelatedProductsSlider from "./RelatedProducts";

export default function Post({ post, profile }) {
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState("");
  const [likeCount, setLikeCount] = useState(post?.likeCount ?? 0);
  const [saved, setSaved] = useState(post?.saved ?? false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [products, setProducts] = React.useState([]);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFetchProducts = async () => {
    const response = await getProductRelatedToPost(post.description);
    if (response) {
      console.log(response?.data);
      setProducts(response?.data);
    }
  };

  useEffect(() => {
    handleFetchProducts();
  }, []);

  const { _id } = JSON.parse(localStorage.getItem("login"));
  const handleLike = async (e) => {
    e.preventDefault();
    dispatch(updateLike({ id: post.id }));
    if (post.liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }

    const response = post.liked
      ? await DislikePost(post.id)
      : await likePost(post.id);

    if (response == null) {
      dispatch(updateLike({ id: post.id }));
    }
  };

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

  const handleAddComment = async () => {
    const response = await addComment({ id: post.id, text: commentText });
    if (response) {
      setCommentText("");
    }
  };

  const handleDeletePost = async (e) => {
    e.stopPropagation();
    const confirmation = window.confirm("Are you sure to delete this post?");
    if (!confirmation) return;
    const response = await deletePost(post.id);
    if (response) {
      if (profile) {
        dispatch(getProfile(post.author?.id));
      } else {
        dispatch(getPosts());
      }
    }
  };
  const handleSavePost = async (e) => {
    e.stopPropagation();
    // const confirmation = window.confirm("Are you sure to delete this post?");
    // if (!confirmation) return;
    setSaved(!saved);
    const response = saved
      ? await unSavePost(post.id)
      : await savePost(post.id);
    if (response) {
      handleClose();
      CToast.success(
        !saved ? "Post removed from save." : "Post saved successfully."
      );
    } else {
      CToast.error("Something went wrong.");
      setSaved(!saved);
    }
  };

  const [openModal, setOpenModal] = React.useState(false);
  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleModalOpen = () => {
    setOpenModal(true);
  };
  return (
    <>
      <Link
        to={`/posts/${post.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Box
          sx={{
            // borderBottom: "1px solid #eee",
            background: "#fff",
            borderRadius: "10px",
            marginBottom: "1rem",
            border: "1px solid #ddd",
            "&:hover": {
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.05)",
            },
          }}
        >
          <Box>
            <Box padding="1rem" display="flex">
              <Grid item sx={{ paddingRight: "1rem" }}>
                <Link to={`/profile/${post.createdBy?.id}`}>
                  <img
                    src={post.createdBy?.image?.url || defaultProfile}
                    alt="lgoog"
                    width="50px"
                    style={{ borderRadius: "12px" }}
                  />
                </Link>
              </Grid>
              <Box>
                <Typography
                  sx={{ fontSize: "16px", fontWeight: 500, mr: "6px" }}
                >
                  {post.createdBy?.fullName}
                </Typography>
                <Typography sx={{ fontSize: "15px", mr: "6px", color: "#555" }}>
                  @{post.createdBy?.username}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: "15px", mr: "6px", color: "#555" }}>
                .
              </Typography>
              <Typography sx={{ fontSize: "15px", mr: "6px", color: "#555" }}>
                {formatDistanceToNow(new Date(post?.createdAt))}
              </Typography>

              <IconButton
                style={{ marginLeft: "auto" }}
                aria-expanded={open ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(e);
                }}
              >
                <MoreVert />
              </IconButton>

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={(e) => e.stopPropagation()}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                {post.createdBy?.id === _id && (
                  <MenuItem onClick={(e) => handleDeletePost(e)}>
                    Delete Post
                  </MenuItem>
                )}
                <MenuItem onClick={(e) => handleSavePost(e)}>
                  {saved ? "Unsave Post" : "Save Post"}
                </MenuItem>
              </Menu>
            </Box>

            <Box padding={"1rem"}>
              <Typography sx={{ fontSize: "15px", color: "#555" }}>
                {parseStyledText(post.description)}
              </Typography>
            </Box>
            <Box padding={"1rem"} component={"div"}>
              {post.images?.length > 0 && (
                <Carousel
                  autoPlay={false}
                  animation="slide"
                  indicators={false}
                  timeout={500}
                  sx={{ height: "auto" }}
                >
                  {post.images.map((image, index) => (
                    <img
                      src={image?.url}
                      alt="post"
                      style={{
                        objectFit: "contain",
                        borderRadius: "10px",
                      }}
                      height={"auto"}
                      width="100%"
                      key={index}
                    />
                  ))}
                </Carousel>
              )}
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              padding={"1rem "}
              borderTop={"1px solid #ddd"}
            >
              <IconButton
                style={{
                  borderRadius: "10px",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleModalOpen();
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
                onClick={handleLike}
                size="medium"
              >
                {post.liked ? (
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
                  {likeCount}
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
                    post.description,
                    `#/posts/${post.id}`
                  );
                }}
              >
                <ShareIcon fontSize="medium" />
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
          </Box>
        </Box>
      </Link>
      <Box>
        {products && products.length > 0 && (
          <RelatedProductsSlider products={products} />
        )}
      </Box>
      {openModal && (
        <Modal
          open={openModal}
          handleClose={handleModalClose}
          saveText={"Comment"}
          len={commentText.trimStart().length}
          handleSave={handleAddComment}
        >
          <Box>
            <Grid container>
              <Grid item>
                <img src={logo} alt="logo" width="60px" />
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
              </Grid>
            </Grid>
          </Box>
        </Modal>
      )}
    </>
  );
}
