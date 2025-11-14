// src/pages/Auth/DeliveryRegister.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import authApi from "../../api/authApi";
import { setUser } from "../../slices/userSlice";

const DeliveryRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    vehicleNumber: "",
    drivingLicense: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      toast.error("Enter a valid 10-digit mobile number!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        vehicleNumber: form.vehicleNumber.trim(),
        drivingLicense: form.drivingLicense.trim(),
      };

      const response = await authApi.deliveryRegister(payload);

      if (response?.data?.success) {
        dispatch(setUser({ user: response.data.user }));
        toast.success("Registration successful! Complete your profile.");
        navigate("/delivery/profile");
      } else {
        toast.error(response?.data?.message || "Registration failed");
      }
    } catch (err) {
      console.error("Delivery register error:", err);
      toast.error(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkBg text-white relative overflow-hidden">

      {/* ✨ Neon Glow Background */}
      <div className="absolute inset-0 bg-linear-to-r from-[#00ff9d1a] via-[#00c8ff1a] to-[#00ff9d1a] blur-3xl animate-pulse" />

      {/* ✨ Registration Card */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg bg-darkCard/90 p-10 rounded-3xl shadow-neon-green border border-gray-800 backdrop-blur-xl z-10"
      >
        <h1 className="text-4xl font-extrabold text-center text-neonGreen neon-text mb-4">
          Delivery Partner Register
        </h1>
        <p className="text-center text-gray-400 mb-8 text-sm">
          Sign up to start receiving delivery requests and earn.
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            autoComplete="name"
            className="input-neon"
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            autoComplete="email"
            className="input-neon"
          />

          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="Mobile Number (10 digits)"
            required
            pattern="[0-9]{10}"
            autoComplete="tel"
            className="input-neon"
          />

          <input
            name="vehicleNumber"
            type="text"
            value={form.vehicleNumber}
            onChange={handleChange}
            placeholder="Vehicle Number (optional)"
            autoComplete="off"
            className="input-neon"
          />

          <input
            name="drivingLicense"
            type="text"
            value={form.drivingLicense}
            onChange={handleChange}
            placeholder="Driving License No. (optional)"
            autoComplete="off"
            className="input-neon"
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            autoComplete="new-password"
            className="input-neon"
          />

          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            autoComplete="new-password"
            className="input-neon"
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-neonGreen hover:bg-[#00ffaa]/80 text-black font-bold rounded-xl shadow-neon transition-all duration-300"
          >
            {loading ? "Registering..." : "Register as Delivery"}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link to="/login/delivery" className="text-neonGreen hover:underline font-semibold">
            Login
          </Link>
        </p>

        <div className="text-center mt-6">
          <Link to="/" className="text-gray-500 text-xs hover:text-neonGreen transition">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default DeliveryRegister;




