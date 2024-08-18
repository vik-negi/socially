import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Route } from "react-router-dom";

export default function PrivateRoute({ path, ...props }) {
  const { isLoggedIn } = useSelector((state) => state.auth);
  if (isLoggedIn) {
    return <Route path={path} {...props} />;
  } else {
    return <Navigate to="/login" />;
  }
}
