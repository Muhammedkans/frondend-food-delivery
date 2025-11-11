// src/api/authApi.js
import axiosClient from "./axiosClient";

const authApi = {
    // ------------------------------------
    // ✅ CUSTOMER AUTH
    // ------------------------------------
    customerRegister: (data) =>
        axiosClient.post("/auth/customer/register", data),

    customerLogin: (data) =>
        axiosClient.post("/auth/customer/login", data),

    // ------------------------------------
    // ✅ RESTAURANT AUTH
    // ------------------------------------
    restaurantRegister: (data) =>
        axiosClient.post("/auth/restaurant/register", data),

    restaurantLogin: (data) =>
        axiosClient.post("/auth/restaurant/login", data),

    // ------------------------------------
    // ✅ DELIVERY PARTNER AUTH
    // ------------------------------------
    deliveryRegister: (data) =>
        axiosClient.post("/auth/delivery/register", data),

    deliveryLogin: (data) =>
        axiosClient.post("/auth/delivery/login", data),

    // ------------------------------------
    // ✅ ADMIN LOGIN
    // ------------------------------------
    adminLogin: (data) =>
        axiosClient.post("/auth/admin/login", data),

    // ------------------------------------
    // ✅ LOGOUT (ALL ROLES)
    // ------------------------------------
    logout: () => axiosClient.post("/auth/logout"),
};

export default authApi;
