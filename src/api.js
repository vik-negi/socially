import axios from "axios";
import axiosInstance from "./utils/axios_instence";
import CToast from "./utils/components/Toast";
import { genAI } from "./utils/gemini_config";

export const addPost = async (postData) => {
  try {
    const { data } = await axiosInstance.post("/post/", postData);
    return data;
  } catch (error) {
    alert("Something went wrong.");
  }
};

export const getLikedPostsByUsers = async (id) => {
  try {
    const { data } = await axiosInstance.get("/post/user/liked-posts/" + id);
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const addComment = async (commentData) => {
  try {
    const { data } = await axiosInstance.post("/comments", commentData);
    return data;
  } catch (error) {
    alert("Something went wrong.");
  }
};

export const likePost = async (id) => {
  try {
    const { data } = await axiosInstance.patch("/post/like/" + id);
    return data;
  } catch (error) {
    CToast.error("Something went wrong.");
    return null;
  }
};
export const savePost = async (id) => {
  try {
    const userId = JSON.parse(localStorage.getItem("login"))._id;
    const { data } = await axiosInstance.post(
      "/saved-posts/save" + `?userId=${userId}&postId=${id}`
    );
    return data;
  } catch (error) {
    CToast.error("Something went wrong.");
    return null;
  }
};
export const unSavePost = async (id) => {
  try {
    const userId = JSON.parse(localStorage.getItem("login"))._id;
    const { data } = await axiosInstance.post(
      "/saved-posts/unsave" + `?userId=${userId}&postId=${id}`
    );
    return data;
  } catch (error) {
    CToast.error("Something went wrong.");
    return null;
  }
};
export const getSavePost = async () => {
  try {
    const userId = JSON.parse(localStorage.getItem("login"))._id;
    const { data } = await axiosInstance.get(`/saved-posts/user/${userId}`);
    return data;
  } catch (error) {
    return null;
  }
};

export const DislikePost = async (id) => {
  try {
    const { data } = await axiosInstance.patch("/post/dislike/" + id);
    return data;
  } catch (error) {
    CToast.error("Something went wrong.");
    return null;
  }
};

export const deletePost = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/post/${id}`);
    return data;
  } catch (error) {
    CToast.error("Something went wrong.");
  }
};
export const deleteComment = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/comments/${id}`);
    return data;
  } catch (error) {
    CToast.error("Something went wrong.");
  }
};

export const followAccount = async (userId) => {
  try {
    const { data } = await axiosInstance.post("/follow/" + `?userId=${userId}`);
    return data;
  } catch (error) {
    alert("Something went wrong.");
  }
};

export const followingAccount = async (follow) => {
  try {
    const { data } = await axiosInstance.post("/followings", follow);
    return data;
  } catch (error) {
    alert("Something went wrong.");
  }
};

export const unfollowAccount = async (followId) => {
  try {
    const { data } = await axiosInstance.delete("/follow/" + followId);
    return data;
  } catch (error) {
    alert("Something went wrong.");
  }
};

export const unfollowingAccount = async (follow) => {
  try {
    const { data } = await axiosInstance.delete(
      "/api/followings?followingId=" + follow.id + "&userId=" + follow.userId
    );
    return data;
  } catch (error) {
    alert("Something went wrong.");
  }
};

export const getResponseForGivenPrompt = async (prompt) => {
  try {
    const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log("response of ai ", response);
    const text = await response.text();
    return text;
  } catch (error) {
    console.log("Something Went Wrong");
    return null;
  }
};
export const getProductRelatedToPost = async (q) => {
  try {
    const { data } = await axios.post("http://localhost:5000/api/products", {
      q,
    });
    return data;
  } catch (error) {
    console.log("Something Went Wrong");
    return null;
  }
};
