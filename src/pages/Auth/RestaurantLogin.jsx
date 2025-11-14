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

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill both email and password.");
      return;
    }

    setLoading(true);
    try {
      // use the correct api call
      const response = await authApi.restaurantLogin({ email, password });

      if (response?.data?.success) {
        const user = response.data.user;

        // role check: ensure this is a restaurant account
        if (user.role !== "restaurant") {
          toast.error("You are not authorized as a restaurant user.");
          setLoading(false);
          return;
        }

        // save user in redux
        dispatch(setUser({ user }));

        toast.success("Welcome back — Restaurant dashboard loading!");
        // redirect to restaurant dashboard (index of /restaurant)
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
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* subtle neon glow */}
      <div className="absolute inset-0 bg-linear-to-r from-[#00ff9d10] via-[#00c8ff10] to-[#00ff9d10] blur-[100px] animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#0d0d0d]/90 p-8 rounded-2xl shadow-[0_10px_40px_rgba(0,255,170,0.06)] border border-[#1a1a1a] z-10"
      >
        <h2 className="text-3xl font-extrabold text-center neon-text mb-4">Restaurant Login</h2>
        <p className="text-center text-gray-400 mb-6 text-sm">Access your restaurant dashboard and manage orders.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="restaurant@example.com"
              className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-[#00ffaa]"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-[#00ffaa]"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-neonGreen text-black font-bold rounded-lg shadow-[0_8px_30px_rgba(0,255,170,0.12)]"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <p className="mt-5 text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <Link to="/register/restaurant" className="text-neonGreen hover:underline font-semibold">
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

export default RestaurantLogin;

