import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../api/axios.config";

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
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("newPassword", { required: true })}
          type="password"
          placeholder="New Password"
        />
        {errors.password && <p>password is required</p>}
        <input
          {...register("confirmPassword", {
            required: "Confirm your password",
            validate: (value, formValues) => {
              value === formValues.newPassword || "Password do not match";
            },
          })}
          type="password"
          placeholder="Confirm Password"
        />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

        {errors.root && <p>{errors.root.message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Reseting..." : "Reset password"}
        </button>
      </form>
    </>
  );
};

export default ResetPassword;
