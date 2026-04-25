import { useState } from "react";
import axios from "../api/axios.config";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import MyButton from "../components/ui/Button";
import MyForm from "./../components/ui/MyForm";
import MyInput from "../components/ui/MyInput";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
  const [Submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm();

  const navigate = useNavigate();

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
      console.error("Register error:", error);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="auth-layout-container h-screen w-screen  flex justify-center items-center bg-linear-to-br from-purple-400/50 via-orange-300/20 to- to-60%  ">
      {/*  */}

      <div className="login-form-container shadow-xl w-full max-w-80 md:max-w-100 m-4 p-2 rounded-2xl grid place-content-center place-items-center leading-6 backdrop-blur-3xl ">
        {/*  */}
        <h1 className="text-2xl md:text-4xl font-thin p-5 ">
          Create your account
        </h1>

        {/*  */}
        <GoogleLogin
          theme="filled_blue"
          shape="pill"
          size="large"
          text="signup_with"
          width={100}
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
              console.log("res", res.data);
              setUser(res.data.user);
              setIsAuthenticated(true);
              navigate("/profile");
            } catch (error) {
              setError({ message: error.res.data.message });
              console.log(error.response?.data || error.message); // ✅ HERE
            } finally {
              setSubmitting(false);
            }
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
        {/*  */}

        <p className="text-md text-gray-400 font-thinp p-2">or</p>

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
