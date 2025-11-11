// src/utils/protectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// role = "customer" | "restaurant" | "delivery" | "admin"
const ProtectedRoute = ({ children, role }) => {
  const { user } = useSelector((state) => state.user);

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // Role mismatch
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
