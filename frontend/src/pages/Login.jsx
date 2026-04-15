import { useState, useContext } from "react";
import axios from "../api/axios.config";
import { authContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const Login = () => {
  const [Submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm();

  const [
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    setLoading,
  ] = useContext(authContext);

  const navigate = useNavigate();

  async function loginHandler(data) {
    try {
      const response = await axios.post(
        "/auth/login",
        {
          email: data.email,
          password: data.password,
        },

        {
          withCredentials: true,
        },
      );

      const userData = response.data;

      setSubmitting(true);
      setUser(userData);
      setIsAuthenticated(true);
      navigate("/profile");
      reset();
    } catch (error) {
      setError("root", { message: error.response.data.message });
      console.error("Login error:", error);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit(loginHandler)}>
        <input
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          type="text"
          placeholder="email"
        />
        {errors.email && <p>Email is required</p>}
        {errors.email?.type === "pattern" && <p>Please enter a valid email</p>}
        <input
          {...register("password", { required: true })}
          type="password"
          placeholder="Password"
        />
        {errors.password && <p>password is required</p>}

        {errors.root && <p>{errors.root.message}</p>}

        <button type="submit" disabled={Submitting}>
          {Submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </>
  );
};

export default Login;
