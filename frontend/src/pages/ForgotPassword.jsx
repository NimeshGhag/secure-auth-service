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
    <div className="auth-layout-container min-h-[100dvh] flex items-center justify-center px-4 bg-linear-to-br from-purple-400/50 via-orange-300/20 to-60%">
      {/*  */}
      <div className="forgot-form-container shadow-xl w-full max-w-md p-6 rounded-2xl flex flex-col items-center backdrop-blur-3xl bg-white/30 ">
        {/*  */}

        <h1 className="text-2xl md:text-3xl font-light py-4">
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
