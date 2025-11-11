// src/pages/Signup.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../redux/slices/userSlice";
import Toast from "../components/Toast";
import Loader from "../components/Loader";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error, message } = useSelector((s) => s.user);

  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  useEffect(() => {
    if (error) setToast({ type: "error", message: error });
    if (message) setToast({ type: "success", message });
    if (user) navigate("/");
  }, [error, message, user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name || !form.email || !form.password) {
      setToast({ type: "error", message: "All fields are required" });
      return false;
    }
    if (form.password.length < 6) {
      setToast({
        type: "error",
        message: "Password must be at least 6 characters",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(signupUser(form));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      {toast && <Toast type={toast.type} message={toast.message} />}

      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
          Create Account
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 
              text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 
              focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@mail.com"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 
              text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 
              focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 
              text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 
              focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Register As
            </label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 
              text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 
              focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="customer">Customer</option>
              <option value="restaurant">Restaurant Owner</option>
              <option value="delivery">Delivery Partner</option>
            </select>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white 
            py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {loading ? <Loader small /> : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-700 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;




