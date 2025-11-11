// src/api/deliveryApi.js
import axiosClient from "./axiosClient";

const deliveryApi = {
    // ------------------------------------
    // ✅ GO ONLINE / GO OFFLINE
    // ------------------------------------
    toggleOnlineStatus: () =>
        axiosClient.put("/delivery/online"),

    // ------------------------------------
    // ✅ UPDATE LIVE LOCATION
    // ------------------------------------
    updateLocation: (data) =>
        axiosClient.put("/delivery/location", data),

    // ------------------------------------
    // ✅ ACCEPT ORDER
    // ------------------------------------
    acceptOrder: (orderId) =>
        axiosClient.put(`/delivery/accept/${orderId}`),

    // ------------------------------------
    // ✅ REJECT ORDER
    // ------------------------------------
    rejectOrder: (orderId) =>
        axiosClient.put(`/delivery/reject/${orderId}`),

    // ------------------------------------
    // ✅ MARK ORDER AS PICKED UP
    // ------------------------------------
    markPickedUp: (orderId) =>
        axiosClient.put(`/delivery/picked-up/${orderId}`),

    // ------------------------------------
    // ✅ MARK ORDER AS DELIVERED
    // ------------------------------------
    markDelivered: (orderId) =>
        axiosClient.put(`/delivery/delivered/${orderId}`),

    // ------------------------------------
    // ✅ DELIVERY DASHBOARD
    // ------------------------------------
    getDashboard: () =>
        axiosClient.get("/delivery/dashboard"),
};

export default deliveryApi;
