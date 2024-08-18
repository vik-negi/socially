import Login from "./pages/Login";

import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import "swiper/css";

import { HashRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import PostDetails from "./pages/PostDetails";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { logout, setAuth } from "./redux/authSlice";
import axiosInstance from "./utils/axios_instence";
import Cloader from "./utils/components/loader";
import LikedPosts from "./pages/LikedPosts";
import SavedPosts from "./pages/savedPosts";

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ("login" in localStorage) {
      const login = JSON.parse(localStorage.getItem("login"));
      axios.defaults.headers.common["authorization"] = `Bearer ${login.token}`;
      dispatch(setAuth({ isLoggedIn: login !== null }));

      checkTokenExpiry(login._id);
    }
  }, [dispatch, isLoggedIn]);

  const checkTokenExpiry = async (id) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/users/" + id);
    } catch (e) {
      if (e.response?.status === 401) {
        console.log("error", e.response.status);
        dispatch(logout());
      }
    }
    setLoading(false);
  };
  if (loading)
    return (
      <div className="text-center mt-5">
        <Cloader />
      </div>
    );

  if (isLoggedIn === null || isLoggedIn == {} || isLoggedIn === false)
    return (
      <HashRouter base="/">
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </HashRouter>
    );
  return (
    <HashRouter base="/">
      <Routes>
        <Route
          exact
          path="/profile/:id"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />

        <Route
          exact
          path="/posts/:id"
          element={
            <Layout>
              <PostDetails />
            </Layout>
          }
        />

        <Route
          exact
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          exact
          path="/likedBy/:id"
          element={
            <Layout>
              <LikedPosts />
            </Layout>
          }
        />
        <Route
          exact
          path="/:id/saved-posts"
          element={
            <Layout>
              <SavedPosts />
            </Layout>
          }
        />

        <Route path="/login" element={<Login />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
