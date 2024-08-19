import { Button, CircularProgress, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { registerUser } from "../redux/authSlice";

export default function RegisterForm() {
  const [registerData, setRegisterData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const history = useNavigate();
  const { status, isLoggedIn } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(registerData));
  };

  useEffect(() => {
    if (isLoggedIn) {
      history.push("/");
    }
  }, [isLoggedIn, history]);
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        onChange={(e) =>
          setRegisterData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }
        name="fullName"
        sx={{
          width: "100%",
          margin: "1rem 0",
          bgcolor: "#fff",
        }}
        variant="outlined"
        label="Enter full name"
        type="text"
        required
      />
      <TextField
        name="username"
        onChange={(e) =>
          setRegisterData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }
        sx={{ width: "100%", margin: "1rem 0", bgcolor: "#fff" }}
        variant="outlined"
        label="Enter Username"
        type="text"
        required
      />
      <TextField
        name="email"
        onChange={(e) =>
          setRegisterData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }
        sx={{ width: "100%", margin: "1rem 0", bgcolor: "#fff" }}
        variant="outlined"
        label="Enter Email"
        type="email"
        required
      />
      <TextField
        name="password"
        onChange={(e) =>
          setRegisterData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }
        sx={{ width: "100%", margin: "1rem 0", bgcolor: "#fff" }}
        variant="outlined"
        label="Enter Password"
        type="password"
        required
      />
      <Button
        disabled={
          registerData.email.trimStart().length === 0 ||
          registerData.password.trimStart().length === 0 ||
          registerData.username.trimStart().length === 0 ||
          registerData.fullName.trimStart().length === 0
        }
        type="submit"
        sx={{
          width: "100%",
          margin: "1.5rem 0",
          padding: "12px 0",
          borderRadius: "12px",
        }}
        variant="contained"
        color="primary"
      >
        {status === "loading" ? (
          <CircularProgress size={24} sx={{ color: "#FFF" }} />
        ) : (
          "Register"
        )}
      </Button>
    </form>
  );
}
