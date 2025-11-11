// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/userSlice";
import Toast from "../components/Toast";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error, message } = useSelector((s) => s.user);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (error) setToast({ type: "error", message: error });
    if (message) setToast({ type: "success", message });
    if (user) navigate("/");
  }, [error, message, user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setToast({ type: "error", message: "All fields are required" });
      return;
    }

    dispatch(loginUser(form));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      {toast && <Toast type={toast.type} message={toast.message} />}

      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 
              text-gray-800 dark:text-gray-100 outline-none border border-gray-300 
              dark:border-gray-600 focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 
              text-gray-800 dark:text-gray-100 outline-none border border-gray-300 
              dark:border-gray-600 focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white 
            py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {loading ? <Loader small /> : "Login"}
          </button>
        </form>

        {/* Signup link */}
        <p className="text-center mt-6 text-gray-700 dark:text-gray-300">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-600 underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;







