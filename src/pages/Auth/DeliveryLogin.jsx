// src/pages/Auth/DeliveryLogin.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import authApi from "../../api/authApi";
import { setUser } from "../../slices/userSlice";

const DeliveryLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.deliveryLogin({ email, password });

      if (response?.data?.success) {
        const user = response.data.user;

        // role-check to ensure this is a delivery user
        if (user.role !== "delivery") {
          toast.error("You are not authorized as a delivery partner.");
          setLoading(false);
          return;
        }

        // Save user in redux
        dispatch(setUser({ user }));

        toast.success("Welcome back — delivery dashboard loading!");
        navigate("/delivery");
      } else {
        toast.error(response?.data?.message || "Login failed");
      }
    } catch (err) {
      console.error("Delivery login error:", err);
      toast.error(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkBg text-white relative overflow-hidden">

      {/* ✨ Premium Neon Background Glow */}
      <div className="absolute inset-0 bg-linear-to-r from-[#00ff9d1a] via-[#00c8ff1a] to-[#00ff9d1a] blur-3xl animate-pulse"></div>

      {/* ✨ Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-darkCard/90 p-8 rounded-2xl shadow-neon-green border border-gray-800 backdrop-blur-xl z-10"
      >
        <h2 className="text-3xl font-extrabold text-center text-neonGreen neon-text mb-4">
          Delivery Partner Login
        </h2>
        <p className="text-center text-gray-400 mb-6 text-sm">
          Sign in to view your assigned deliveries and start earning.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="delivery@example.com"
            autoComplete="email"
            className="input-neon"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            autoComplete="current-password"
            className="input-neon"
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-neonGreen hover:bg-[#00ffaa]/80 text-black font-bold rounded-xl shadow-neon transition-all duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <p className="mt-5 text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <Link to="/register/delivery" className="text-neonGreen hover:underline font-semibold">
            Register
          </Link>
        </p>

        <div className="text-center mt-4">
          <Link to="/" className="text-gray-500 text-xs hover:text-neonGreen transition">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default DeliveryLogin;


