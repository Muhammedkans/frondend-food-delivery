import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../slices/userSlice";
import authApi from "../../api/authApi";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const CustomerRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.customerRegister({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      if (response.data.success) {
        dispatch(loginUser(response.data.user));
        toast.success("Registration Successful!");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkBg text-white relative overflow-hidden">
      {/* ✅ Animated background glow */}
      <div className="absolute inset-0 bg-linear-to-r from-[#00ff9d1a] via-[#00c8ff1a] to-[#00ff9d1a] blur-3xl animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-darkCard/90 p-10 rounded-3xl shadow-neon-green border border-gray-800 backdrop-blur-xl z-10"
      >
        <h1 className="text-4xl font-extrabold text-center text-neonGreen neon-text mb-8">
          Join Neon Eats
        </h1>

        {/* ✅ Register Form */}
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-4">
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="input-neon"
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="input-neon"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="input-neon"
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="input-neon"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            type="submit"
            className="w-full py-3 bg-neonGreen hover:bg-[#00ffaa]/80 text-black font-bold rounded-xl shadow-neon transition-all duration-300"
          >
            {loading ? "Registering..." : "Create Account"}
          </motion.button>
        </form>

        {/* ✅ Login Redirect */}
        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login/customer"
            className="text-neonGreen hover:underline font-semibold"
          >
            Login
          </Link>
        </p>

        {/* ✅ Back to Home link (added) */}
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

export default CustomerRegister;




