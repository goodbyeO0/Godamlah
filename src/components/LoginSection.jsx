import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const LoginSection = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get("http://localhost:3000/api/users");
      const users = response.data.users;

      const user = users.find(
        (u) =>
          (u.email === formData.emailOrUsername ||
            u.telegramUsername === formData.emailOrUsername) &&
          u.password === formData.password
      );

      if (user) {
        const { password, ...userWithoutPassword } = user;
        login(userWithoutPassword);
        alert(`Welcome back, ${user.fullName}!`);
        navigate("/user");
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-3xl shadow-lg w-[90%] max-w-md">
        <h2 className="text-3xl font-bold text-[#001646] mb-6 text-center">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FiMail className="absolute left-3 top-3.5 text-gray-500" />
            <input
              type="text"
              name="emailOrUsername"
              placeholder="Email or Telegram Username"
              value={formData.emailOrUsername}
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
          <button
            type="submit"
            className="w-full bg-[#0172B1] text-white p-3 rounded-full text-lg font-semibold hover:bg-[#001646] transition-all"
          >
            Log In
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <span
            className="text-[#0172B1] font-semibold cursor-pointer"
            onClick={() => navigate("/")}
          >
            Sign up
          </span>
        </p>
        <p className="text-sm text-center mt-4 text-blue-500">
          forgot password
        </p>
      </div>
    </div>
  );
};

export default LoginSection;
