import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const RestaurantRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    restaurantName: "",
    gstNumber: "",
    fssaiNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/restaurant/register`,
        form,
        { withCredentials: true }
      );

      if (res.data.success) {
        navigate("/restaurant/dashboard"); // ✅ Redirect after signup
      }
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message ||
          "Registration failed. Try again."
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center px-4">
      <div className="glass-card w-full max-w-xl p-8 rounded-2xl shadow-xl">

        <h1 className="text-3xl font-bold text-neonGreen text-center mb-4">
          Create Restaurant Account 🍽️
        </h1>

        <p className="text-center text-gray-400 mb-6">
          Register your restaurant & start receiving orders
        </p>

        {errorMsg && (
          <p className="text-red-500 text-center mb-4">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* ✅ Owner Name */}
          <div className="md:col-span-2">
            <label className="text-gray-300 mb-1 block">Owner Name</label>
            <input
              name="name"
              required
              type="text"
              value={form.name}
              onChange={handleChange}
              className="input-neon"
              placeholder="John Doe"
            />
          </div>

          {/* ✅ Email */}
          <div>
            <label className="text-gray-300 mb-1 block">Email</label>
            <input
              name="email"
              required
              type="email"
              value={form.email}
              onChange={handleChange}
              className="input-neon"
              placeholder="example@gmail.com"
            />
          </div>

          {/* ✅ Phone */}
          <div>
            <label className="text-gray-300 mb-1 block">Phone</label>
            <input
              name="phone"
              required
              type="text"
              value={form.phone}
              onChange={handleChange}
              className="input-neon"
              placeholder="9876543210"
            />
          </div>

          {/* ✅ Password */}
          <div>
            <label className="text-gray-300 mb-1 block">Password</label>
            <input
              name="password"
              required
              type="password"
              value={form.password}
              onChange={handleChange}
              className="input-neon"
              placeholder="******"
            />
          </div>

          {/* ✅ Restaurant Name */}
          <div>
            <label className="text-gray-300 mb-1 block">Restaurant Name</label>
            <input
              name="restaurantName"
              required
              type="text"
              value={form.restaurantName}
              onChange={handleChange}
              className="input-neon"
              placeholder="Delicious Biryani Hub"
            />
          </div>

          {/* ✅ GST */}
          <div>
            <label className="text-gray-300 mb-1 block">GST Number</label>
            <input
              name="gstNumber"
              required
              type="text"
              value={form.gstNumber}
              onChange={handleChange}
              className="input-neon"
              placeholder="GST-XXXXX"
            />
          </div>

          {/* ✅ FSSAI */}
          <div>
            <label className="text-gray-300 mb-1 block">FSSAI Number</label>
            <input
              name="fssaiNumber"
              required
              type="text"
              value={form.fssaiNumber}
              onChange={handleChange}
              className="input-neon"
              placeholder="FSSAI-XXXXX"
            />
          </div>

          {/* ✅ Submit Button full width */}
          <div className="md:col-span-2">
            <button
              disabled={loading}
              className="w-full bg-neonGreen text-black font-bold py-3 rounded-xl hover:opacity-80 transition-all mt-2"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </div>
        </form>

        <div className="text-center text-gray-400 mt-5">
          Already have an account?{" "}
          <Link
            to="/restaurant/login"
            className="text-neonBlue underline"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

// ✅ Reusable neon input style
const inputStyle = `
  w-full bg-black/40 border border-neonGreen/40 text-white px-4 py-3 rounded-xl 
  focus:border-neonGreen outline-none
`;

export default RestaurantRegister;
