import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiSend } from "react-icons/fi";
import axios from "axios";

const RegisterSection = ({ setIsRegistered }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    telegramUsername: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/register", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        telegramUsername: formData.telegramUsername,
      });

      setIsRegistered(true);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Registration failed. Please try again.";
      alert(errorMessage);
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-3xl shadow-lg w-[90%] max-w-md">
        <h2 className="text-3xl font-bold text-[#001646] mb-6 text-center">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FiUser className="absolute left-3 top-3.5 text-gray-500" />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full pl-10 p-3 border rounded-full focus:ring-2 focus:ring-[#0172B1]"
              required
            />
          </div>
          <div className="relative">
            <FiMail className="absolute left-3 top-3.5 text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 p-3 border rounded-full focus:ring-2 focus:ring-[#0172B1]"
              required
            />
          </div>
          <div className="relative">
            <FiSend className="absolute left-3 top-3.5 text-gray-500" />
            <input
              type="text"
              name="telegramUsername"
              placeholder="Telegram Username"
              value={formData.telegramUsername}
              onChange={handleChange}
              className="w-full pl-10 p-3 border rounded-full focus:ring-2 focus:ring-[#0172B1]"
              required
            />
          </div>
          <div className="relative">
            <FiLock className="absolute left-3 top-3.5 text-gray-500" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 p-3 border rounded-full focus:ring-2 focus:ring-[#0172B1]"
              required
            />
          </div>
          <div className="relative">
            <FiLock className="absolute left-3 top-3.5 text-gray-500" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 p-3 border rounded-full focus:ring-2 focus:ring-[#0172B1]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#0172B1] text-white p-3 rounded-full text-lg font-semibold hover:bg-[#001646] transition-all"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            className="text-[#0172B1] font-semibold cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterSection;
