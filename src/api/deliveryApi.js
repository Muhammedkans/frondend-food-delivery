// src/api/deliveryApi.js
import axiosClient from "./axiosClient";

const deliveryApi = {
  // ------------------------------------------------
  // 🟢 TOGGLE ONLINE / OFFLINE STATUS
  // ------------------------------------------------
  toggleOnlineStatus: () => axiosClient.put("/delivery/online"),

  // ------------------------------------------------
  // 📍 UPDATE LIVE LOCATION
  // ------------------------------------------------
  updateLocation: (data) => axiosClient.put("/delivery/location", data),

  // ------------------------------------------------
  // 📝 UPDATE ORDER STATUS
  // (Picked Up / Delivered)
  // ------------------------------------------------
  updateStatus: (orderId, status) =>
    axiosClient.put(`/delivery/status/${orderId}`, { status }),

  // ------------------------------------------------
  // 📊 DELIVERY DASHBOARD
  // ------------------------------------------------
  getDashboard: () => axiosClient.get("/delivery/dashboard"),

  // ------------------------------------------------
  // 👤 GET DELIVERY PARTNER PROFILE
  // ------------------------------------------------
  getProfile: () => axiosClient.get("/delivery/profile"),

  // ------------------------------------------------
  // ✏️ UPDATE DELIVERY PROFILE (FORMDATA + FILE UPLOAD)
  // ------------------------------------------------
  updateProfile: (formData) =>
    axiosClient.put("/delivery/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Browser automatically sets the boundaries
      },
    }),
};

export default deliveryApi;










