// src/api/axiosClient.js

import axios from "axios";

// -----------------------------
// ✅ Create Axios Instance
// -----------------------------
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Example: https://your-backend.com/api
  withCredentials: true, // Required for sending cookies
});

// -----------------------------
// ✅ Request Interceptor
// -----------------------------
axiosClient.interceptors.request.use(
  (config) => {
    // Add headers or tokens later if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// -----------------------------
// ✅ Response Interceptor
// -----------------------------
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auto logout when token expires or unauthorized
    if (error.response?.status === 401) {
      console.warn("⚠️  Unauthorized — You will be redirected to login.");
      // You can dispatch logout here later
    }

    return Promise.reject(error);
  }
);

// -----------------------------
// ✅ Export
// -----------------------------
export default axiosClient;

