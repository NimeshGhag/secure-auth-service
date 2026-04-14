import { useState, useContext } from "react";
import axios from "../api/axios.config";
import { authContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    setLoading,
  ] = useContext(authContext);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/auth/login",
        {
          email: form.email,
          password: form.password,
        },

        {
          withCredentials: true,
        },
      );

      const userData = response.data;
      setUser(userData);
      setIsAuthenticated(true);
      navigate("/profile")

      console.log("api working", response);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
