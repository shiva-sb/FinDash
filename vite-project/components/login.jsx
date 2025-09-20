import React from "react";
import './aruth.css';
import { useForm } from "react-hook-form";
import Axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const submitCall = async (data) => {
    try {
      const response = await Axios.post(
        "http://localhost:8001/api/auth/login",
        data,
        { withCredentials: true } // important to send cookie
      );

      alert("Login successful");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="authContainer">
      <form className="authForm" onSubmit={handleSubmit(submitCall)}>
        <h1 className="authTitle">Login</h1>
        <div className="inputGroup">
          <label className="label">Email: </label>
          <input
            className="input"
            {...register("email", {
              required: "Email required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address"
              }
            })}
            type="email"
            placeholder="Email"
          />
          {errors.email && <div className="error">{errors.email.message}</div>}
        </div>
        <div className="inputGroup">
          <label className="label">Password: </label>
          <input
            className="input"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 5, message: "Password requires at least 5 characters" }
            })}
            type="password"
            placeholder="Password"
          />
          {errors.password && <div className="error">{errors.password.message}</div>}
        </div>
        <button type="submit" className="submitButton">Login</button>
        <p className="toggleText">Don't have an account? <Link to='/register'>Register</Link></p>
      </form>
    </div>
  );
}

export default Login;
