import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const RestaurantLogin = () => {
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
        `${import.meta.env.VITE_API_URL}/api/auth/restaurant/login`,
        form,
        { withCredentials: true }
      );

      if (res.data.success) {
        navigate("/restaurant/dashboard"); // ✅ Redirect to restaurant dashboard
      }
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message || "Login failed, try again."
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center px-4">
      <div className="glass-card p-8 rounded-2xl w-full max-w-md shadow-xl">

        <h1 className="text-3xl font-bold text-neonBlue text-center mb-6">
          Restaurant Login 🍽️
        </h1>

        <p className="text-center text-gray-400 mb-6">
          Login to manage your restaurant
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
              className="w-full bg-black/40 border border-neonBlue/40 text-white px-4 py-3 rounded-xl focus:border-neonBlue outline-none"
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
              className="w-full bg-black/40 border border-neonBlue/40 text-white px-4 py-3 rounded-xl focus:border-neonBlue outline-none"
              placeholder="Enter password"
            />
          </div>

          {/* ✅ Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neonBlue text-black font-bold py-3 rounded-xl hover:opacity-80 transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* ✅ Links */}
        <div className="text-center mt-5 text-gray-400">

          <p className="mt-2">
            Not registered?{" "}
            <Link to="/restaurant/register" className="text-neonGreen underline">
              Create restaurant account
            </Link>
          </p>

          <p className="mt-2">
            Customer Login?{" "}
            <Link to="/login" className="text-neonYellow underline">
              Click here
            </Link>
          </p>

          <p className="mt-2">
            Delivery Partner Login?{" "}
            <Link to="/delivery/login" className="text-neonPink underline">
              Click here
            </Link>
          </p>

          <p className="mt-2">
            Admin Panel?{" "}
            <Link to="/admin/login" className="text-neonBlue underline">
              Click here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default RestaurantLogin;
