// Register.js
import React from "react";
import './aruth.css';
import { useForm } from "react-hook-form";
import Axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  // ✨ FIXED: Restored the API call logic
  const submitCall = async (data) => {
    try {
      const response = await Axios.post('http://localhost:8001/api/auth/register', data);
      if (response) {
        alert("Registered successfully");
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="authContainer">
      <div className="authLayout">
        <div className="authWelcomePanel">
          <div className="panelContent">
            <h1 className="panelTitle">📊 FinDash</h1>
            <p className="panelSubtitle">Unlock Insights from Your Financial Data</p>
            <ul className="featureList">
              <li>Visualize your data with interactive charts.</li>
              <li>Compare financial statements side-by-side.</li>
              <li>Ask questions and get instant insights with AI.</li>
            </ul>
          </div>
        </div>
        <form className="authForm" onSubmit={handleSubmit(submitCall)}>
          <h1 className="authTitle">Create an account</h1>
          <div className="inputGroup">
            <label className="label">Username: </label>
            <input className="input" {...register("username", { required: "Username is required", minLength: { value: 3, message: "Name must be at least 3 characters" } })} id="username" type="text" placeholder="Username" />
            {errors.username && <div className="error">{errors.username.message}</div>}
          </div>
          <div className="inputGroup">
            <label className="label">Email: </label>
            <input className="input" {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" } })} id="email" type="email" placeholder="Email" />
            {errors.email && <div className="error">{errors.email.message}</div>}
          </div>
          <div className="inputGroup">
            <label className="label">Password: </label>
            <input className="input" {...register("password", { required: "Password is required", minLength: { value: 5, message: "Password requires at least 5 characters" } })} id="password" type="password" placeholder="Password" />
            {errors.password && <div className="error">{errors.password.message}</div>}
          </div>
          <button type="submit" className="submitButton">Register</button>
          <p className="toggleText">
            Already have an account? <Link to='/login' className="toggleLink">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;