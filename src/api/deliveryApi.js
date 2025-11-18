// src/api/deliveryApi.js
import axiosClient from "./axiosClient";

const deliveryApi = {

    // ------------------------------------------------
    // ✅ GO ONLINE / GO OFFLINE
    // ------------------------------------------------
    toggleOnlineStatus: () => 
        axiosClient.put("/delivery/online"),

    // ------------------------------------------------
    // ✅ UPDATE LIVE LOCATION
    // ------------------------------------------------
    updateLocation: (data) => 
        axiosClient.put("/delivery/location", data),

    // ------------------------------------------------
    // ✅ UPDATE ORDER STATUS
    // (accepted, rejected, picked_up, delivered)
    // ------------------------------------------------
    updateStatus: (orderId, status) => 
        axiosClient.put(`/delivery/status/${orderId}`, { status }),

    // ------------------------------------------------
    // ✅ DELIVERY DASHBOARD
    // ------------------------------------------------
    getDashboard: () => 
        axiosClient.get("/delivery/dashboard"),

    // ------------------------------------------------
    // 👤 GET DELIVERY PARTNER PROFILE
    // ------------------------------------------------
    getProfile: () => 
        axiosClient.get("/delivery/profile"),

    // ------------------------------------------------
    // ✏️ UPDATE DELIVERY PROFILE
    // (profilePhoto + licenseImage → formData)
    // ------------------------------------------------
    updateProfile: (formData) => 
        axiosClient.put("/delivery/profile", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),
};

export default deliveryApi;




