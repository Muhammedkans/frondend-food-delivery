// src/api/restaurantApi.js
import axiosClient from "./axiosClient";

const restaurantApi = {
    // -------------------------------------------------
    // ✅ GET RESTAURANT PROFILE (OWNER ONLY)
    // -------------------------------------------------
    getProfile: () =>
        axiosClient.get("/restaurant/profile"),

    // -------------------------------------------------
    // ✅ UPDATE RESTAURANT PROFILE (Banner + Logo)
    // -------------------------------------------------
    updateProfile: (formData) =>
        axiosClient.put("/restaurant/update", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    // -------------------------------------------------
    // ✅ ADD DISH
    // -------------------------------------------------
    addDish: (formData) =>
        axiosClient.post("/restaurant/dish", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    // -------------------------------------------------
    // ✅ UPDATE DISH BY ID
    // -------------------------------------------------
    updateDish: (dishId, formData) =>
        axiosClient.put(`/restaurant/dish/${dishId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    // -------------------------------------------------
    // ✅ DELETE DISH BY ID
    // -------------------------------------------------
    deleteDish: (dishId) =>
        axiosClient.delete(`/restaurant/dish/${dishId}`),

    // -------------------------------------------------
    // ✅ PUBLIC — RESTAURANT MENU
    // -------------------------------------------------
    getRestaurantMenu: (restaurantId) =>
        axiosClient.get(`/restaurant/menu/${restaurantId}`),

    // -------------------------------------------------
    // ✅ PUBLIC — ALL RESTAURANTS
    // -------------------------------------------------
    getAllRestaurants: () =>
        axiosClient.get("/restaurant/all"),

    // -------------------------------------------------
    // ✅ PUBLIC — SINGLE RESTAURANT DETAILS
    // (You added getSingleRestaurant in backend)
    // -------------------------------------------------
    getSingleRestaurant: (restaurantId) =>
        axiosClient.get(`/restaurant/${restaurantId}`),

    // -------------------------------------------------
    // ✅ TOGGLE OPEN/CLOSE STATUS (Owner Only)
    // -------------------------------------------------
    toggleStatus: () =>
        axiosClient.put("/restaurant/toggle-status"),
};

export default restaurantApi;

