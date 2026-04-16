import React from "react";
import { useForm } from "react-hook-form";
import axios from "../api/axios.config";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm();

  async function forgotPasswordHandler(data) {
    const respnse = await axios.post("/auth/forgot-password", {
      email: data.email,
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit(forgotPasswordHandler)}>
        <input
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          type="text"
          placeholder="email"
        />
        {errors.email && <p>Email is required</p>}
        {errors.email?.type === "pattern" && <p>Please enter a valid email</p>}

        {errors.root && <p>{errors.root.message}</p>}

        <button type="submit" >
          Update Password
        </button>
      </form>
    </>
  );
};

export default ForgotPassword;
