import React, { useState } from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import logo from "../logo.png";
import { useMediaQuery } from "@mui/material";

export default function Login() {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const theme = useTheme();
  const isMobileDevice = useMediaQuery("(max-width:380px)");
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        width: "100vw",
        height: "100vh",
        paddingY: isLoginForm ? "0" : "5rem",
        bgcolor: isMobileDevice ? "#fff" : "#f5f5f5",
      }}
    >
      <Box
        borderRadius={"12px"}
        sx={{
          width: "350px",
          bgcolor: "#fff",
          padding: " 2rem 2rem",
          margin: isMobileDevice ? 0 : "2rem",
          boxShadow: !isMobileDevice && "0px 0px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Box textAlign="center" marginBottom="1rem">
          <img style={{ width: "70px" }} src={logo} alt="Logo" />
          {isLoginForm ? (
            <Typography variant="h5">Sign in</Typography>
          ) : (
            <Typography variant="h5">Sign up</Typography>
          )}
        </Box>
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
