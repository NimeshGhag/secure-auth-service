import { useState } from "react";
import axios from "../api/axios.config";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

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
    <>
      <form onSubmit={handleSubmit(registerHandler)}>
        <input
          {...register("name", { required: true })}
          type="text"
          placeholder="Name"
        />
        {errors.name && <p>Name is required</p>}
        <input
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          type="text"
          placeholder="email"
        />
        {errors.email && <p>Email is required</p>}
        {errors.email?.type === "pattern" && <p>Please enter a valid email</p>}
        <input
          {...register("password", { required: true, minLength: 6 })}
          type="password"
          placeholder="Password"
        />
        {errors.password && <p>password is required</p>}
        {errors.password?.type === "minLength" && (
          <p>Password must be at least 6 characters</p>
        )}

        {errors.root && <p>{errors.root.message}</p>}

        <button type="submit" disabled={Submitting}>
          {Submitting ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </>
  );
};

export default Register;
