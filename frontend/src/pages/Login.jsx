import { useState, useContext, useEffect } from "react";
import axios from "../api/axios.config";
import { authContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { GoogleLogin } from "@react-oauth/google";

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

  const [showResend, setShowResend] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();

  async function loginHandler(data) {
    try {
      setSubmitting(true);
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

      const userData = response.data.user;

      setUser(userData);
      setIsAuthenticated(true);
      navigate("/profile");
      reset();
    } catch (error) {
      setError("root", { message: error.response.data.message });

      if (
        error.response.data.message ===
        "Please verify your email before logging in"
      ) {
        setShowResend(true);
      }
      console.error("Login error:", error);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendVerification(data) {
    try {
      const response = await axios.post(
        "/auth/resend-verification",
        {
          email: data.email,
        },
        {
          withCredentials: true,
        },
      );

      const coolTimeData = response.data.cooldown;

      setCooldown(coolTimeData);
    } catch (error) {
      console.error("Error resending verification email:", error);
    }
  }
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

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

        {showResend && (
          <button
            onClick={handleSubmit(handleResendVerification)}
            disabled={cooldown > 0}
          >
            {cooldown ? `Resend in ${cooldown}` : "Resend Verification Email"}
          </button>
        )}

        <small onClick={() => navigate("/forgot-password")}>
          forgot password
        </small>

        <button type="submit" disabled={Submitting}>
          {Submitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div></div>

      <small>
        Don't have an account
        <span onClick={() => navigate("/register")}>Register</span>
      </small>

      <p>OR continue with Google</p>

      <GoogleLogin
        onSuccess={async (response) => {
          try {
            setSubmitting(true);
            const res = await axios.post(
              "/auth/google",
              {
                idToken: response.credential,
              },
              {
                withCredentials: true,
              },
            );
            setUser(res.data.user);
            console.log(res.data);
            setIsAuthenticated(true);
            navigate("/profile");
          } catch (error) {
            setError({ message: error.res.data.message });
          } finally {
            setSubmitting(false);
          }
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </>
  );
};

export default Login;
