// src/pages/Auth/RestaurantLogin.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import authApi from "../../api/authApi";
import { setUser } from "../../slices/userSlice";
import { motion } from "framer-motion";

const RestaurantLogin = () => {
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
      const response = await authApi.restaurantLogin({ email, password });

      if (response?.data?.success) {
        const user = response.data.user;

        if (user.role !== "restaurant") {
          toast.error("You are not authorized as a restaurant user.");
          setLoading(false);
          return;
        }

        dispatch(setUser({ user }));
        toast.success("Welcome back — Restaurant Dashboard loading!");
        navigate("/restaurant");
      } else {
        toast.error(response?.data?.message || "Login failed");
      }
    } catch (err) {
      console.error("Restaurant login error:", err);
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
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-darkCard/90 p-10 rounded-3xl shadow-neon-green border border-gray-800 backdrop-blur-xl z-10"
      >
        <h1 className="text-4xl font-extrabold text-center text-neonGreen neon-text mb-2">
          Restaurant Login
        </h1>
        <p className="text-center text-gray-400 mb-8 text-sm">
          Access your restaurant dashboard and manage orders 🚀
        </p>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              placeholder="restaurant@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="input-neon"
            />

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

          {/* LOGIN BUTTON */}
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

        {/* FOOTER */}
        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/register/restaurant"
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

export default RestaurantLogin;


