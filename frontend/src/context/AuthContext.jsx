import axios from "../api/axios.config";
import React, { useEffect } from "react";

import { createContext, useState } from "react";

export const authContext = createContext(null);
const AuthContext = (props) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/auth/profile", {
          withCredentials: true,
        });
        console.log("Auth check response:", response.data.user);
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error occurred:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <authContext.Provider
      value={[
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        loading,
        setLoading,
      ]}
    >
      {props.children}
    </authContext.Provider>
  );
};

export default AuthContext;
