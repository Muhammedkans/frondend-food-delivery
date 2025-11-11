// src/api/axiosClient.js

import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Example: http://localhost:5000/api
    withCredentials: true, // ✅ Required for cookies
});

axiosClient.interceptors.request.use(
    (config) => {
        // ✅ Additional logic later if needed
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // ✅ Auto logout on unauthorized
        if (error.response?.status === 401) {
            console.warn("Unauthorized — redirecting to login.");
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
