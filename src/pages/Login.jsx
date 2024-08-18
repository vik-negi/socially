import React, { useState } from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import logo from "../logo.png";

export default function Login() {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const theme = useTheme();
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        width: "100vw",
        height: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      <Box
        borderRadius={theme.shape.borderRadius}
        sx={{
          width: theme.breakpoints.values.sm,
          bgcolor: "#fff",
          padding: " 3rem 2rem",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Box textAlign="center" marginBottom="1rem">
          <img style={{ width: "100px" }} src={logo} alt="Logo" />
        </Box>
        {isLoginForm ? (
          <Typography variant="h5">Login to your account</Typography>
        ) : (
          <Typography variant="h5">Create a new account</Typography>
        )}
        {isLoginForm ? <LoginForm /> : <RegisterForm />}
        {isLoginForm ? (
          <Box textAlign="center" margin=".5rem 0">
            Don't have an account?{" "}
            <Link
              style={{ textDecoration: "none", cursor: "pointer" }}
              onClick={() => setIsLoginForm(false)}
            >
              Create one
            </Link>
          </Box>
        ) : (
          <Box textAlign="center" margin=".5rem 0">
            Already registered?{" "}
            <Link
              style={{ textDecoration: "none", cursor: "pointer" }}
              onClick={() => setIsLoginForm(true)}
            >
              Sign in
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  );
}
