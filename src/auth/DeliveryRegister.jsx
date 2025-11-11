import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const DeliveryRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    vehicleNumber: "",
    drivingLicense: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/delivery/register`,
        form,
        { withCredentials: true }
      );

      if (res.data.success) {
        navigate("/delivery/dashboard"); // ✅ Redirect
      }
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message || "Registration failed. Try again."
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center px-4">
      <div className="glass-card p-8 rounded-2xl w-full max-w-md shadow-xl">

        <h1 className="text-3xl font-bold text-neonPink text-center mb-6">
          Delivery Partner Registration 🚴‍♂️
        </h1>

        <p className="text-center text-gray-400 mb-6">
          Create an account & start earning
        </p>

        {errorMsg && (
          <p className="text-red-500 text-center mb-4">{errorMsg}</p>
        )}

        <form onSubmit={handleRegister} className="space-y-5">

          {/* ✅ Name */}
          <div>
            <label className="text-gray-300 mb-1 block">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full bg-black/40 border border-neonPink/40 text-white px-4 py-3 rounded-xl focus:border-neonPink outline-none"
              placeholder="Enter your name"
            />
          </div>

          {/* ✅ Email */}
          <div>
            <label className="text-gray-300 mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full bg-black/40 border border-neonPink/40 text-white px-4 py-3 rounded-xl focus:border-neonPink outline-none"
              placeholder="Enter email"
            />
          </div>

          {/* ✅ Phone */}
          <div>
            <label className="text-gray-300 mb-1 block">Phone Number</label>
            <input
              type="text"
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
              className="w-full bg-black/40 border border-neonPink/40 text-white px-4 py-3 rounded-xl focus:border-neonPink outline-none"
              placeholder="Enter phone number"
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
              className="w-full bg-black/40 border border-neonPink/40 text-white px-4 py-3 rounded-xl focus:border-neonPink outline-none"
              placeholder="Create password"
            />
          </div>

          {/* ✅ Bike Number */}
          <div>
            <label className="text-gray-300 mb-1 block">Vehicle Number</label>
            <input
              type="text"
              name="vehicleNumber"
              required
              value={form.vehicleNumber}
              onChange={handleChange}
              className="w-full bg-black/40 border border-neonPink/40 text-white px-4 py-3 rounded-xl focus:border-neonPink outline-none"
              placeholder="KL 07 AB 1234"
            />
          </div>

          {/* ✅ Driving License */}
          <div>
            <label className="text-gray-300 mb-1 block">Driving License</label>
            <input
              type="text"
              name="drivingLicense"
              required
              value={form.drivingLicense}
              onChange={handleChange}
              className="w-full bg-black/40 border border-neonPink/40 text-white px-4 py-3 rounded-xl focus:border-neonPink outline-none"
              placeholder="DL Number"
            />
          </div>

          {/* ✅ Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neonPink text-black font-bold py-3 rounded-xl hover:opacity-80 transition-all"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* ✅ Links */}
        <div className="text-center mt-5 text-gray-400">

          <p>
            Already have an account?{" "}
            <Link to="/delivery/login" className="text-neonYellow underline">
              Login
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

export default DeliveryRegister;
