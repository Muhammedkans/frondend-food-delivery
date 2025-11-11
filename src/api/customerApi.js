// src/api/customerApi.js
import axiosClient from "./axiosClient";

const customerApi = {
    // ------------------------------------
    // ✅ HOMEPAGE RESTAURANTS
    // ------------------------------------
    getHomepageRestaurants: () =>
        axiosClient.get("/customer/restaurants"),

    // ------------------------------------
    // ✅ GET MENU OF A RESTAURANT
    // ------------------------------------
    getMenu: (restaurantId) =>
        axiosClient.get(`/customer/menu/${restaurantId}`),

    // ------------------------------------
    // ✅ CART APIs
    // ------------------------------------
    getCart: () =>
        axiosClient.get("/customer/cart"),

    addToCart: (data) =>
        axiosClient.post("/customer/cart/add", data),

    updateCartItem: (data) =>
        axiosClient.put("/customer/cart/update", data),

    removeFromCart: (dishId) =>
        axiosClient.delete(`/customer/cart/remove/${dishId}`),

    clearCart: () =>
        axiosClient.delete("/customer/cart/clear"),

    // ------------------------------------
    // ✅ ORDER APIs
    // ------------------------------------
    placeOrder: (data) =>
        axiosClient.post("/customer/order", data),

    getMyOrders: () =>
        axiosClient.get("/customer/orders"),

    getActiveOrder: () =>
        axiosClient.get("/customer/order/active"),
};

export default customerApi;


