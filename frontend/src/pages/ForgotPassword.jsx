import React from "react";
import { useForm } from "react-hook-form";
import axios from "../api/axios.config";
import MyForm from "../components/ui/MyForm";
import MyInput from "../components/ui/MyInput";
import MyButton from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm();

  const navigate = useNavigate();

  async function forgotPasswordHandler(data) {
    try {
      const respnse = await axios.post("/auth/forgot-password", {
        email: data.email,
      });
      alert(respnse?.data?.message);
    } catch (error) {
      setError("root", {
        message: error.response?.data?.message,
      });
    }
  }

  return (
    <div className="auth-layout-container h-screen w-screen  flex justify-center items-center bg-linear-to-br from-purple-400/50 via-orange-300/20 to- to-60%  ">
      {/*  */}
      <div className="login-form-container shadow-xl w-full max-w-80 md:max-w-100 m-4 p-4 rounded-2xl grid place-content-center place-items-center leading-6 backdrop-blur-3xl ">
        {/*  */}

        <h1 className="text-2xl md:text-4xl font-thin p-5 ">
          Reset your password
        </h1>

        <p className="text-md md:text-lg text-center  text-gray-700  font-thin p-5 ">
          Input your register email to reset your password
        </p>
        {/*  */}
        <MyForm onSubmit={handleSubmit(forgotPasswordHandler)}>
          <MyInput
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            type="text"
            placeholder="Your Email"
          />
          {errors.email && <p>Email is required</p>}
          {errors.email?.type === "pattern" && (
            <p className="text-red-600 text-sm">Please enter a valid email</p>
          )}

          {errors.root && (
            <p className="text-red-600 text-sm">{errors.root.message}</p>
          )}

          <MyButton type="submit">
            Submit
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

export default ForgotPassword;
