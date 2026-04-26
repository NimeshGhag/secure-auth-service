import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../api/axios.config";
import MyForm from "../components/ui/MyForm";
import MyButton from "../components/ui/Button";
import MyInput from "../components/ui/MyInput";

const ResetPassword = () => {
  const [SearchParams] = useSearchParams();
  const token = SearchParams.get("token");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    setloading(true);
    try {
      const response = await axios.post(`/auth/reset-password/${token}`, {
        newPassword: data.newPassword,
      });
      alert("Password reset successful");

      navigate("/");
    } catch (error) {
      setError("root", {
        message: error.response?.data?.message || "Somthing went wrong",
      });
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="aauth-layout-container min-h-[100dvh] flex items-center justify-center px-4 bg-linear-to-br from-purple-400/50 via-orange-300/20 to-60%">
      <div className="ogin-form-container shadow-xl w-full max-w-md p-6 rounded-2xl flex flex-col items-center backdrop-blur-3xl bg-white/30 ">
        {/*  */}

        <h1 className="text-2xl md:text-3xl font-light py-4">Update password</h1>

        <p className="text-md md:text-xl text-center  text-gray-700  font-thin p-5 ">
          New password shouldn't match old password
        </p>
        {/*  */}

        <MyForm onSubmit={handleSubmit(onSubmit)}>
          <MyInput
            {...register("newPassword", { required: true })}
            type="password"
            placeholder="New Password"
          />
          {errors.password && (
            <p className="text-red-600 text-sm">password is required</p>
          )}
        

          {errors.root && (
            <p className="text-red-600 text-sm">{errors.root.message}</p>
          )}

          <MyButton type="submit" disabled={loading}>
            {loading ? "Reseting..." : "Reset password"}
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

export default ResetPassword;
