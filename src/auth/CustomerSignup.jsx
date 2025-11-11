import { useState } from "react";
import axios from "axios";
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CustomerSignup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      setError("");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register/customer`,
        form,
        { withCredentials: true }
      );

      if (res.data.success) {
        navigate("/");
      }
    } catch (err) {
      setError("Email already exists");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="glass-card p-10 rounded-3xl w-full max-w-md">

        <h1 className="text-3xl text-center font-bold text-neonBlue mb-8">
          Create Your Account ✨
        </h1>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-center mb-4">{error}</p>
        )}

        {/* Name */}
        <label className="text-gray-400 text-sm">Full Name</label>
        <div className="input neon-border mb-4">
          <FiUser />
          <input
            type="text"
            className="w-full bg-transparent outline-none text-white"
            placeholder="Mohammad..."
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </div>

        {/* Email */}
        <label className="text-gray-400 text-sm">Email</label>
        <div className="input neon-border mb-4">
          <FiMail />
          <input
            type="email"
            className="w-full bg-transparent outline-none text-white"
            placeholder="example@gmail.com"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        {/* Phone */}
        <label className="text-gray-400 text-sm">Phone</label>
        <div className="input neon-border mb-4">
          <FiPhone />
          <input
            type="text"
            className="w-full bg-transparent outline-none text-white"
            placeholder="9876543210"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />
        </div>

        {/* Address */}
        <label className="text-gray-400 text-sm">Delivery Address</label>
        <div className="input neon-border mb-4">
          <FiMapPin />
          <input
            type="text"
            className="w-full bg-transparent outline-none text-white"
            placeholder="Street, City..."
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />
        </div>

        {/* Password */}
        <label className="text-gray-400 text-sm">Password</label>
        <div className="input neon-border mb-4">
          <FiLock />
          <input
            type="password"
            className="w-full bg-transparent outline-none text-white"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        <button
          onClick={handleSignup}
          className="w-full bg-neonPink text-black font-bold py-3 rounded-xl hover:opacity-80 transition"
        >
          Sign Up
        </button>

        <p className="text-gray-500 mt-6 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-neonGreen cursor-pointer"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default CustomerSignup;
