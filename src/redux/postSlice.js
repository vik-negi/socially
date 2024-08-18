import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../utils/axios_instence";

const initialState = {
  status: "idle",
  posts: [],
  postDetails: {},
  commentStatus: "idle",
  comments: [],
};

export const getPosts = createAsyncThunk("post/getPosts", async () => {
  const { data } = await axiosInstance.get("/post");
  return data;
});

export const getPostDetails = createAsyncThunk(
  "post/getPostDetails",
  async (id) => {
    const { data } = await axiosInstance.get("/post/" + id);
    return data;
  }
);

export const getComments = createAsyncThunk("post/getComments", async (id) => {
  const { data } = await axiosInstance.get("/comments/" + id);
  return data;
});

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    updateLike: (state, action) => {
      const index = state.posts.findIndex(
        (post) => post.id === action.payload.id
      );
      state.posts[index].liked = !state.posts[index].liked;
    },
    updatePostDetailsLike: (state, action) => {
      if (state.postDetails.liked) {
        state.postDetails.likeCount -= 1;
      } else {
        state.postDetails.likeCount += 1;
      }
      state.postDetails.liked = !state.postDetails.liked;
    },
    updateComment: (state, action) => {
      if (action.payload.delete != null) {
        const index = state.comments.findIndex((comment) =>
          action.payload.comment.parentCommentId == null
            ? comment.id == action.payload.comment.id
            : comment.id == action.payload.comment.parentCommentId
        );
        if (index !== -1) {
          state.postDetails.commentCount -= 1;
          if (action.payload.comment.parentCommentId == null) {
            state.comments.splice(index, 1);
          } else {
            state.comments[index].replies = state.comments[
              index
            ].replies.filter((reply) => reply.id !== action.payload.comment.id);
            state.comments[index].replyCount -= 1;
          }
        }
      } else if (action.payload.add) {
        state.postDetails.commentCount += 1;
        if (action.payload.comment.parentCommentId != null) {
          const index = state.comments.findIndex(
            (comment) => comment.id === action.payload.comment.parentCommentId
          );
          state.comments[index].replies.unshift(action.payload.comment);
          state.comments[index].replyCount += 1;
        } else {
          state.comments.unshift(action.payload.comment);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.status = "success";
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(getPostDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getPostDetails.fulfilled, (state, action) => {
        state.status = "success";
        state.postDetails = action.payload;
      })
      .addCase(getPostDetails.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(getComments.pending, (state, action) => {
        state.commentStatus = "loading";
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.commentStatus = "success";
        console.log("sssssssssssssssss " + action.payload);
        state.comments = action.payload;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.commentStatus = "failed";
      });
  },
});

export default postSlice.reducer;
export const { updateLike, updateComment, updatePostDetailsLike } =
  postSlice.actions;
