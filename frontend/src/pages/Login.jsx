import { useState, useContext, useEffect } from "react";
import axios from "../api/axios.config";
import { authContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { GoogleLogin } from "@react-oauth/google";
import MyInput from "../components/ui/MyInput";
import MyButton from "../components/ui/Button";
import MyForm from "../components/ui/MyForm";

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
    <div className="auth-layout-container min-h-[100dvh] flex items-center justify-center px-4 bg-linear-to-br from-purple-400/50 via-orange-300/20 to-60%">
      {/*  */}
      <div className="login-form-container shadow-xl w-full max-w-md p-6 rounded-2xl flex flex-col items-center backdrop-blur-3xl bg-white/30 ">
        {/*  */}
        <h1 className="text-2xl md:text-3xl font-light py-4 ">Welcome Back!</h1>

        {/*  */}

        <GoogleLogin
          theme="filled_blue"
          shape="pill"
          size="large"
          text="signin_with"
          width="100%"
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
              setIsAuthenticated(true);
              navigate("/profile");
            } catch (error) {
              setError({ message: error.res.data.message || error.message });
            } finally {
              setSubmitting(false);
            }
          }}
          onError={(e) => {
            console.log("Login Failed");
          }}
        />

        {/*  */}

        <p className="text-md text-gray-400 font-thin p-2">or</p>

        {/*  */}

        <MyForm onSubmit={handleSubmit(loginHandler)}>
          <MyInput
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            type="text"
            placeholder="Email"
          />
          {errors.email && <p className="text-red-600">Email is required</p>}
          {errors.email?.type === "pattern" && (
            <p className="text-red-600 text-sm">Please enter a valid email</p>
          )}

          <MyInput
            {...register("password", { required: true })}
            type="password"
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-red-600 text-sm">password is required</p>
          )}

          {errors.root && (
            <p className="text-red-600 text-sm">{errors.root.message}</p>
          )}
          <p
            className="text-sm text-right  font-light cursor-pointer text-blue-500 hover:text-blue-600 hover:ease-in-out hover:delay-100 hover:underline py-1"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password
          </p>

          {showResend && (
            <button
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={handleSubmit(handleResendVerification)}
              disabled={cooldown > 0}
            >
              {cooldown ? `Resend in ${cooldown}` : "Resend Verification Email"}
            </button>
          )}

          <MyButton type="submit" disabled={Submitting}>
            {Submitting ? "Logging in..." : "Log in"}
          </MyButton>
        </MyForm>

        {/*  */}

        <div className="p-2 md:p-3 md:mb-2 ">
          <span
            className="text-center text-sm text-blue-500 hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
