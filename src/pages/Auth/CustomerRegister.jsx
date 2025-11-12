// src/pages/Auth/CustomerRegister.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../slices/userSlice";
import authApi from "../../api/authApi";
import { toast } from "react-hot-toast";

const CustomerRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.customerRegister({ name, email, password });
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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-black via-gray-900 to-black">
      <div className="w-full max-w-md p-8 bg-[#111111] rounded-3xl shadow-2xl border border-gray-800">
        <h2 className="text-4xl font-extrabold text-neonGreen text-center mb-8">
          Neon Eats
        </h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-4 rounded-xl bg-gray-900 border border-neonGreen focus:outline-none focus:ring-2 focus:ring-neonGreen text-white"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-4 rounded-xl bg-gray-900 border border-neonGreen focus:outline-none focus:ring-2 focus:ring-neonGreen text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-4 rounded-xl bg-gray-900 border border-neonGreen focus:outline-none focus:ring-2 focus:ring-neonGreen text-white"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-4 rounded-xl bg-gray-900 border border-neonGreen focus:outline-none focus:ring-2 focus:ring-neonGreen text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-neonGreen hover:bg-green-500 rounded-xl font-bold text-black text-lg transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login/customer" className="text-neonGreen font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerRegister;



