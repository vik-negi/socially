import axios from "axios";
import { useNavigate, useNavigation } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { useDispatch } from "react-redux";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if ("login" in localStorage) {
      const login = JSON.parse(localStorage.getItem("login"));
      config.headers.Authorization = login.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // if (error.response && error.response.status == 401) {
    //   console.log(
    //     "Error from axios interceptors",
    //     error.response.status,
    //     error.response
    //   );
    //   alert("Session expired. Please login again.");

    //   const dispatch = useDispatch();
    //   console.log("Logging out");
    //   dispatch(logout());
    // }
    return Promise.reject(error);
  }
);

export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out");
    localStorage.removeItem("token");
    navigate("/login");
  };
  handleLogout();

  return handleLogout;
};

export default axiosInstance;
