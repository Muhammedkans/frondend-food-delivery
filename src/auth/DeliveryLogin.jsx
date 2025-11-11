import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const DeliveryLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/delivery/login`,
        form,
        { withCredentials: true }
      );

      if (res.data.success) {
        navigate("/delivery/dashboard"); // ✅ Redirect
      }
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message || "Login failed. Try again."
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center px-4">
      <div className="glass-card p-8 rounded-2xl w-full max-w-md shadow-xl">

        <h1 className="text-3xl font-bold text-neonYellow text-center mb-6">
          Delivery Partner Login 🚴‍♂️
        </h1>

        <p className="text-center text-gray-400 mb-6">
          Login to start delivering orders
        </p>

        {errorMsg && (
          <p className="text-red-500 text-center mb-4">{errorMsg}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">

          {/* ✅ Email */}
          <div>
            <label className="text-gray-300 mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full bg-black/40 border border-neonYellow/40 text-white px-4 py-3 rounded-xl focus:border-neonYellow outline-none"
              placeholder="Enter email"
            />
          </div>

          {/* ✅ Password */}
          <div>
            <label className="text-gray-300 mb-1 block">Password</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full bg-black/40 border border-neonYellow/40 text-white px-4 py-3 rounded-xl focus:border-neonYellow outline-none"
              placeholder="Enter password"
            />
          </div>

          {/* ✅ Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neonYellow text-black font-bold py-3 rounded-xl hover:opacity-80 transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* ✅ Links */}
        <div className="text-center mt-5 text-gray-400">

          <p className="mt-2">
            New Delivery Partner?{" "}
            <Link to="/delivery/register" className="text-neonPink underline">
              Register here
            </Link>
          </p>

          <p className="mt-2">
            Customer Login?{" "}
            <Link to="/login" className="text-neonGreen underline">
              Click here
            </Link>
          </p>

          <p className="mt-2">
            Restaurant Login?{" "}
            <Link to="/restaurant/login" className="text-neonBlue underline">
              Click here
            </Link>
          </p>

          <p className="mt-2">
            Admin Panel?{" "}
            <Link to="/admin/login" className="text-neonYellow underline">
              Click here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default DeliveryLogin;
