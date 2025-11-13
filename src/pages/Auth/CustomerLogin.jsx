import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { loginUser } from "../../slices/userSlice";
import authApi from "../../api/authApi";

const CustomerLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authApi.customerLogin({ email, password });
      if (response.data.success) {
        dispatch(loginUser(response.data.user));
        toast.success("Welcome back to Neon Eats!");
        navigate("/");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || "Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkBg text-white relative overflow-hidden">
      {/* ✨ Animated neon background glow */}
      <div className="absolute inset-0 bg-linear-to-r from-[#00ff9d1a] via-[#00c8ff1a] to-[#00ff9d1a] blur-3xl animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-darkCard/90 p-10 rounded-3xl shadow-neon-green border border-gray-800 backdrop-blur-xl z-10"
      >
        <h1 className="text-4xl font-extrabold text-center text-neonGreen neon-text mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-gray-400 mb-8 text-sm tracking-wide">
          Login to continue your neon journey 🚀
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-neon"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-neon"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-neonGreen hover:bg-[#00ffaa]/80 text-black font-bold rounded-xl shadow-neon transition-all duration-300"
          >
            {loading ? "Logging In..." : "Login"}
          </motion.button>
        </form>

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




