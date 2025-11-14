// src/pages/Auth/CustomerLogin.jsx

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import authApi from "../../api/authApi";
import { setUser } from "../../slices/userSlice";

const CustomerLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields!");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.customerLogin({ email, password });

      if (response.data.success) {
        dispatch(setUser({ user: response.data.user }));
        toast.success("Welcome back to Neon Eats ⚡");
        navigate("/customer");
      } else {
        toast.error(response.data.message || "Invalid credentials!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">

      {/* ✨ EXACT SAME GLOW AS REGISTER PAGE */}
      <div className="absolute inset-0 
        bg-linear-to-r from-[#00ff9d1a] via-[#00c8ff1a] to-[#00ff9d1a]
        blur-3xl animate-pulse">
      </div>

      {/* ✨ Login Card — Same Glow Theme */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md bg-darkCard/90 p-10 rounded-3xl
          shadow-neon-green border border-gray-800 backdrop-blur-xl z-10"
      >
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center text-neonGreen neon-text mb-2">
          Welcome Back
        </h1>

        <p className="text-center text-gray-400 mb-8 text-sm">
          Login to continue your neon journey 🚀
        </p>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">

            {/* Email */}
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="input-neon"
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="input-neon"
            />

          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full py-3 bg-neonGreen hover:bg-[#00ffaa]/80 text-black
              font-bold rounded-xl shadow-neon transition-all duration-300"
          >
            {loading ? "Logging In..." : "Login"}
          </motion.button>
        </form>

        {/* FOOTER */}
        <p className="mt-6 text-center text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/register/customer"
            className="text-neonGreen hover:underline font-semibold"
          >
            Register
          </Link>
        </p>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-500 text-xs hover:text-neonGreen transition"
          >
            ← Back to Home
          </Link>
        </div>

      </motion.div>
    </div>
  );
};

export default CustomerLogin;

















