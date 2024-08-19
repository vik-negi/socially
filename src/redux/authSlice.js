import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../utils/axios_instence";
import CToast from "../utils/components/Toast";

const initialState = {
  status: "idle",
  isLoggedIn: false,
  user: {},
  profile: {},
  userStatus: "idle",
  users: [],
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData) => {
    console.log(userData);
    axiosInstance.defaults.headers.common["Content-Type"] = "application/json";

    const { data } = await axiosInstance.post("/auth/login", userData);
    console.log("api data", data);
    return data;
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData) => {
    axiosInstance.defaults.headers.common["Content-Type"] =
      "multipart/form-data";
    const { data } = await axiosInstance.post("/auth/register", userData);
    return data;
  }
);

export const getProfile = createAsyncThunk("auth/getProfile", async (id) => {
  const { data } = await axiosInstance.get("/users/" + id);
  return data;
});
export const getUserPosts = createAsyncThunk(
  "auth/getUserPosts",
  async (id) => {
    const { data } = await axiosInstance.get("/post/user/" + id);
    return data;
  }
);

export const getUsers = createAsyncThunk("auth/getUsers", async () => {
  const { data } = await axiosInstance.get("/users");
  return data;
});

export const editProfile = async (body) => {
  // createAsyncThunk("auth/editProfile", async (body, id) => {
  // const { data } =
  return await axiosInstance.patch("/users", body, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
    },
  });
  // return data;
  // });
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    logout: (state, action) => {
      localStorage.clear();
      state.isLoggedIn = false;
      axios.defaults.headers.common["authorization"] = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setFollow: (state, action) => {
      state.profile.follow = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("login data", action.payload);
        const { token, user } = action.payload;
        const { email, id, fullName } = user;

        localStorage.setItem(
          "login",
          JSON.stringify({
            token,
            email,
            _id: id,
            fullName,
            isLoggedIn: true,
          })
        );
        state.user.name = user.name;
        state.user.email = user.email;
        state.user._id = user.id;
        state.status = "success";
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.isLoggedIn = false;
        console.log("login error", action);
        CToast.error(action.payload || "Something went wrong.");
      })
      .addCase(registerUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "success";
        const { token, user } = action.payload;
        const { name, email, id } = user;
        localStorage.setItem(
          "login",
          JSON.stringify({ token, name, email, _id: id, isLoggedIn: true })
        );
        axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
        state.user.name = name;
        state.user.email = email;
        state.isLoggedIn = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.isLoggedIn = false;
      })
      .addCase(getProfile.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.status = "success";
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(getUserPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.status = "success";
        state.posts = action.payload;
      })
      .addCase(getUserPosts.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(getUsers.pending, (state, action) => {
        state.userStatus = "loading";
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.userStatus = "success";
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.userStatus = "failed";
      });
  },
});

export default authSlice.reducer;
export const { setAuth, logout, setFollow } = authSlice.actions;
