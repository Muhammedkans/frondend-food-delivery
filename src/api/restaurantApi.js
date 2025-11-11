// src/api/restaurantApi.js
import axiosClient from "./axiosClient";

const restaurantApi = {
    // ------------------------------------
    // ✅ GET RESTAURANT PROFILE
    // (Restaurant Owner Only)
    // ------------------------------------
    getProfile: () =>
        axiosClient.get("/restaurant/profile"),

    // ------------------------------------
    // ✅ UPDATE RESTAURANT PROFILE
    // (Banner + Logo Upload Supported)
    // ------------------------------------
    updateProfile: (formData) =>
        axiosClient.put("/restaurant/update", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    // ------------------------------------
    // ✅ ADD DISH
    // ------------------------------------
    addDish: (formData) =>
        axiosClient.post("/restaurant/dish", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    // ------------------------------------
    // ✅ UPDATE DISH
    // ------------------------------------
    updateDish: (dishId, formData) =>
        axiosClient.put(`/restaurant/dish/${dishId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    // ------------------------------------
    // ✅ DELETE DISH
    // ------------------------------------
    deleteDish: (dishId) =>
        axiosClient.delete(`/restaurant/dish/${dishId}`),

    // ------------------------------------
    // ✅ PUBLIC API → RESTAURANT MENU
    // ------------------------------------
    getRestaurantMenu: (restaurantId) =>
        axiosClient.get(`/restaurant/menu/${restaurantId}`),

    // ------------------------------------
    // ✅ PUBLIC API → ALL RESTAURANTS
    // ------------------------------------
    getAllRestaurants: () =>
        axiosClient.get("/restaurant/all"),

    // ------------------------------------
    // ✅ TOGGLE OPEN / CLOSE STATUS
    // ------------------------------------
    toggleStatus: () =>
        axiosClient.put("/restaurant/toggle-status"),
};

export default restaurantApi;
