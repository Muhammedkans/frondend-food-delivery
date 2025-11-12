// src/pages/Auth/CustomerLogin.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../slices/userSlice";
import authApi from "../../api/authApi";
import { toast } from "react-hot-toast";

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
        toast.success("Login Successful!");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login Failed");
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
        <form onSubmit={handleLogin} className="space-y-6">
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
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-neonGreen hover:bg-green-500 rounded-xl font-bold text-black text-lg transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{" "}
          <Link to="/register/customer" className="text-neonGreen font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerLogin;


