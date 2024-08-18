import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../utils/axios_instence";

const initialState = {
  followingStatus: "idle",
  followings: [],
  followerStatus: "idle",
  followers: [],
};

export const getFollowings = createAsyncThunk(
  "follow/getFollowings",
  async (id) => {
    const { data } = await axiosInstance.get(
      "/follow/following/users" + `?id=${id}`
    );
    return data;
  }
);

export const getFollowers = createAsyncThunk(
  "follow/getFollowers",
  async (id) => {
    const { data } = await axiosInstance.get("/follow/users" + `?id=${id}`);
    return data;
  }
);

export const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(getFollowings.pending, (state, action) => {
    //   state.followingStatus = "loading";
    // }),
    // builder.addCase(getFollowings.fulfilled, (state, action) => {
    //   state.followingStatus = "success";
    //   state.followings = action.payload.response.followings;
    // }),
    // builder.addCase(getFollowings.rejected, (state, action) => {
    //   state.followingStatus = "failed";
    // }),
    builder.addCase(getFollowers.pending, (state, action) => {
      state.followerStatus = "loading";
    });
    // builder.addCase(getFollowers.fulfilled, (state, action) => {
    //   state.followerStatus = "success";
    //   state.followers = action.payload.response.followers;
    // }),
    // builder.addCase(getFollowers.rejected, (state, action) => {
    //   state.followerStatus = "failed";
    // });
  },
});

export default followSlice.reducer;
// export const {  } = followSlice.actions;
