import { useContext } from "react";
import { authContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = (props) => {
  const [
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    setLoading,
  ] = useContext(authContext);

  if (loading) return <h1>Loading...</h1>;

  if (!user) return <Navigate to="/" />;

  return <>{props.children}</>;
};

export default ProtectedRoute;
