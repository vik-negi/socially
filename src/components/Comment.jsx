import { Grid, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CircleIcon from "@mui/icons-material/Circle";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import logo from "../logo.png";
import { defaultProfile } from "../utils/constants";
import ReplyIcon from "@mui/icons-material/Reply";
import { deleteComment } from "../api";
import { updateComment } from "../redux/postSlice";
import { useDispatch } from "react-redux";

export default function Comment({ comment, handleReply }) {
  const { _id } = JSON.parse(localStorage.getItem("login"))._id;
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteComment = async (e) => {
    e.stopPropagation();
    const response = await deleteComment(comment.id);
    if (response) {
      dispatch(
        updateComment({
          delete: true,
          comment: comment,
        })
      );
    }
  };
  return (
    <Box
      padding="1rem"
      sx={{
        borderBottom: "1px solid #eee",
        backgroundColor: "#fff",
        "&:hover": {
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      <Grid container flexWrap="nowrap">
        <Grid item sx={{ paddingRight: "1rem" }}>
          <img
            src={comment.user.image?.url || defaultProfile}
            alt="logo"
            width="50px"
            style={{ borderRadius: "12px" }}
          />
        </Grid>
        <Grid item flexGrow="1">
          <Box>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              flexWrap="nowrap"
            >
              <Grid item>
                <Box display="flex" alignItems={"center"}>
                  <Typography
                    sx={{ fontSize: "16px", fontWeight: 500, mr: "6px" }}
                  >
                    {comment.user.fullName}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "15px", mr: "6px", color: "#555" }}
                  >
                    @{comment.user.username}
                  </Typography>
                  <CircleIcon
                    sx={{
                      marginX: "6px",
                      fontSize: "10px",
                      color: "#555",
                    }}
                  />
                  <Typography
                    sx={{ fontSize: "15px", mr: "6px", color: "#555" }}
                  >
                    {formatDistanceToNow(new Date(comment.createdAt))}{" "}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "15px", color: "#555" }}>
                    {comment.content}
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <IconButton>
                  <MoreHorizIcon onClick={handleClick} />
                </IconButton>
              </Grid>
              <Menu
                id="basic-top"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => handleClose(false)}
                onClick={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-top-menu",
                }}
              >
                {comment.createdBy?.id === _id && (
                  <MenuItem
                    onClick={(e) => {
                      handleDeleteComment(e);
                      handleClose();
                    }}
                  >
                    Delete Comment
                  </MenuItem>
                )}
              </Menu>
            </Grid>
          </Box>
          <Box display={"flex"} alignItems={"center"} marginTop={"15px"}>
            <IconButton
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "12px",

                "&:hover": {
                  backgroundColor: "#ddd",
                },
              }}
              onClick={() =>
                handleReply(
                  comment?.parentCommentId || comment.id,
                  comment?.user?.username
                )
              }
            >
              <ReplyIcon
                sx={{
                  fontSize: "22px",
                  color: "#555",
                  marginRight: "6px",
                }}
              />
              <Typography
                sx={{ marginRight: "2px", fontSize: "12px", color: "#555" }}
              >
                Reply
              </Typography>
            </IconButton>
            {comment?.replyCount > 0 && (
              <Box display="flex" alignItems="center">
                <CircleIcon
                  sx={{
                    marginRight: "6px",
                    fontSize: "6px",
                    color: "#555",
                  }}
                />
                <Typography sx={{ fontSize: "15px", color: "#555" }}>
                  {comment.replyCount} Replies
                </Typography>
              </Box>
            )}
          </Box>
          {comment?.replies?.map((reply) => (
            <Comment key={reply.id} comment={reply} handleReply={handleReply} />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}
