import React, { useContext } from "react";
import axios from "../api/axios.config";
import { useNavigate } from "react-router-dom";
import { authContext } from "../context/AuthContext";

const Profile = () => {
  const [
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    setLoading,
  ] = useContext(authContext);
  const navigate = useNavigate();

  async function signOutHandler() {
    try {
      const response = await axios.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );
      setUser(null);
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <>
      <div>Profile</div>

      <button onClick={signOutHandler}>Sign Out</button>
    </>
  );
};

export default Profile;
