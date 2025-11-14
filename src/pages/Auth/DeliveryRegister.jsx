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
        // Delivery partners usually go to their profile/dashboard
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
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* neon glow */}
      <div className="absolute inset-0 bg-linear-to-r from-[#00ff9d10] via-[#00c8ff10] to-[#00ff9d10] blur-[100px] animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-[#0d0d0d]/95 p-8 rounded-2xl shadow-[0_20px_60px_rgba(0,255,170,0.06)] border border-[#1a1a1a] z-10"
      >
        <h2 className="text-3xl font-extrabold text-center neon-text mb-3">Delivery Partner Register</h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          Sign up to start receiving delivery requests and earn.
        </p>

        <form onSubmit={handleRegister} className="grid grid-cols-1 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="input-neon"
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="input-neon"
          />

          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="Mobile Number (10 digits)"
            required
            className="input-neon"
          />

          <input
            name="vehicleNumber"
            value={form.vehicleNumber}
            onChange={handleChange}
            placeholder="Vehicle Number (optional)"
            className="input-neon"
          />

          <input
            name="drivingLicense"
            value={form.drivingLicense}
            onChange={handleChange}
            placeholder="Driving License No. (optional)"
            className="input-neon"
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="input-neon"
          />

          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            className="input-neon"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-neonGreen hover:bg-neonGreen/90 text-black font-bold rounded-lg shadow-[0_12px_40px_rgba(0,255,170,0.12)] transition"
          >
            {loading ? "Registering..." : "Register as Delivery"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link to="/login/delivery" className="text-neonGreen hover:underline font-semibold">
            Login
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

export default DeliveryRegister;

