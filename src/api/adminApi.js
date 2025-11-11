// src/api/adminApi.js
import axiosClient from "./axiosClient";

const adminApi = {
    // ------------------------------------
    // ✅ GET ALL CUSTOMERS
    // ------------------------------------
    getAllCustomers: () =>
        axiosClient.get("/admin/customers"),

    // ------------------------------------
    // ✅ GET ALL RESTAURANTS
    // ------------------------------------
    getAllRestaurants: () =>
        axiosClient.get("/admin/restaurants"),

    // ------------------------------------
    // ✅ APPROVE RESTAURANT
    // ------------------------------------
    approveRestaurant: (restaurantId) =>
        axiosClient.put(`/admin/restaurants/approve/${restaurantId}`),

    // ------------------------------------
    // ✅ BLOCK / UNBLOCK RESTAURANT
    // ------------------------------------
    toggleRestaurantBlock: (restaurantId) =>
        axiosClient.put(`/admin/restaurants/block/${restaurantId}`),

    // ------------------------------------
    // ✅ GET ALL DELIVERY PARTNERS
    // ------------------------------------
    getAllDeliveryPartners: () =>
        axiosClient.get("/admin/delivery-partners"),

    // ------------------------------------
    // ✅ GET ALL ORDERS
    // ------------------------------------
    getAllOrders: () =>
        axiosClient.get("/admin/orders"),

    // ------------------------------------
    // ✅ ADMIN DASHBOARD STATS
    // ------------------------------------
    getStats: () =>
        axiosClient.get("/admin/stats"),
};

export default adminApi;
