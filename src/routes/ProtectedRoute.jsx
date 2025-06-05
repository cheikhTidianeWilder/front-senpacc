import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const roleToPath = {
  Urologue: "/urologie",
};

const ProtectedRoute = ({ allowedRole, children }) => {
  const location = useLocation();
  const userRole = localStorage.getItem("role");

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== allowedRole) {
    const correctPath = roleToPath[userRole];
    return <Navigate to={correctPath || "/login"} replace />;
  }

  return children;
};

export default ProtectedRoute;
