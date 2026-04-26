import { useContext, useState } from "react";
import axios from "../api/axios.config";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import MyButton from "../components/ui/Button";
import MyForm from "./../components/ui/MyForm";
import MyInput from "../components/ui/MyInput";
import { GoogleLogin } from "@react-oauth/google";
import { authContext } from "../context/AuthContext";

const Register = () => {
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

  const hasRun = useRef(false);

  async function registerHandler(data) {
    try {
      const response = await axios.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      setSubmitting(true);

      navigate("/");
      reset();
    } catch (error) {
      setError("root", { message: error.response.data.message });
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="auth-layout-container min-h-[100dvh] flex items-center justify-center px-4 bg-linear-to-br from-purple-400/50 via-orange-300/20 to-60%">
      {/*  */}

      <div className="register-form-container shadow-xl w-full max-w-md p-6 rounded-2xl flex flex-col items-center backdrop-blur-3xl bg-white/30">
        {/*  */}
        <h1 className="text-2xl md:text-3xl font-light py-4">
          Create your account
        </h1>

        {/*  */}
        <GoogleLogin
          theme="filled_blue"
          shape="pill"
          size="large"
          text="signup_with"
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
              setError("root",{
                message: error.response?.data?.message || error.message || "Somthing went wrong",
              });
            } finally {
              setSubmitting(false);
            }
          }}
          onError={() => {
            console.log("Register Failed");
          }}
        />
        {/*  */}

        <p className="text-md text-gray-400 font-thin p-2">or</p>

        {/*  */}

        <MyForm onSubmit={handleSubmit(registerHandler)}>
          <MyInput
            {...register("name", { required: true })}
            type="text"
            placeholder="Name"
          />
          {errors.name && (
            <p className="text-red-600 text-sm">Name is required</p>
          )}
          <MyInput
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            type="text"
            placeholder="Email"
          />
          {errors.email && <p>Email is required</p>}
          {errors.email?.type === "pattern" && (
            <p className="text-red-600 text-sm">Please enter a valid email</p>
          )}
          <MyInput
            {...register("password", { required: true, minLength: 6 })}
            type="password"
            placeholder="Password"
          />
          {errors.password && <p>password is required</p>}
          {errors.password?.type === "minLength" && (
            <p className="text-red-600 text-sm">
              Password must be at least 6 characters
            </p>
          )}

          {errors.root && (
            <p className="text-red-600 text-sm">{errors.root.message}</p>
          )}

          <MyButton type="submit" disabled={Submitting}>
            {Submitting ? "Signing up..." : "Sign up"}
          </MyButton>
        </MyForm>

        {/*  */}

        <div className="p-2 md:p-3 md:mb-2 ">
          <span
            className="text-center text-sm text-blue-500 hover:underline cursor-pointer"
            onClick={() => navigate("/")}
          >
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
