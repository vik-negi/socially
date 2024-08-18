import { CircularProgress, Grid, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import AssistantIcon from "@mui/icons-material/Assistant";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../redux/postSlice";
import AddPost from "../components/AddPost";
import { getLikedPostsByUsers } from "../api";
import { useParams } from "react-router-dom";

const LikedPosts = () => {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [posts, setLikedPosts] = React.useState([]);
  const getLikedPosts = async () => {
    setLoading(true);
    const response = await getLikedPostsByUsers(id);
    if (response != null) {
      setLoading(false);
      setLikedPosts(response);
    }
    setLoading(false);
  };
  useEffect(() => {
    getLikedPosts();
  }, []);

  return (
    <Box marginX={"auto"} maxWidth={"700px"}>
      <Box bgcolor="white" borderBottom="1px solid #eee" padding="8px 20px">
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h6">Home</Typography>
          </Grid>
          <Grid item>
            <IconButton>
              <AssistantIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
      <Box
        height="92vh"
        sx={{
          overflowY: "scroll",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <AddPost />
        <Box height={"1rem"} />
        {loading && (
          <Box textAlign="center" marginTop="1rem">
            <CircularProgress size={20} color="primary" />
          </Box>
        )}
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </Box>
    </Box>
  );
};

export default LikedPosts;
