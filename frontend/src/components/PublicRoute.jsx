import React from "react";
import { useContext } from "react";
import { authContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PublicRoute = (props) => {
  const [
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    setLoading,
  ] = useContext(authContext);

  if (user) return <Navigate to="/profile" />;

  return <>{props.children}</>;
};

export default PublicRoute;
