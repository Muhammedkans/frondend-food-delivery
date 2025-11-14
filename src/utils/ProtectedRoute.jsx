// src/utils/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/*
  🚀 WHAT THIS COMPONENT DOES:
  -----------------------------
  ✔ Redirects NOT-LOGGED-IN users based on correct role
  ✔ Prevents role mismatch access
  ✔ Avoids UI flashing while auth state loads
  ✔ Works with Swiggy/Zomato style flow
  ✔ Cleanest & Future-proof
*/

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useSelector((state) => state.user);

  // ⏳ Prevents UI flicker on reload
  if (loading) {
    return (
      <div className="text-white text-center py-10">
        Checking authentication...
      </div>
    );
  }

  // ❌ Not logged in → redirect based on role
  if (!user) {
    switch (role) {
      case "customer":
        return <Navigate to="/login/customer" replace />;
      case "restaurant":
        return <Navigate to="/login/restaurant" replace />;
      case "delivery":
        return <Navigate to="/login/delivery" replace />;
      case "admin":
        return <Navigate to="/login/admin" replace />;
      default:
        return <Navigate to="/login/customer" replace />;
    }
  }

  // ❌ Logged in but WRONG role
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // ✅ All clear → allow page
  return children;
};

export default ProtectedRoute;


