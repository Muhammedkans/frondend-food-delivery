// src/api/chatApi.js
import axiosClient from "./axiosClient";

const chatApi = {
    // ✅ SEND MESSAGE (Text / Image / AI)
    sendMessage: (data) =>
        axiosClient.post("/chat/send", data),

    // ✅ GET CHAT HISTORY (By Order ID)
    getChatHistory: (orderId) =>
        axiosClient.get(`/chat/history/${orderId}`),

    // ✅ MARK ALL MESSAGES IN ORDER AS READ
    markAsRead: (orderId) =>
        axiosClient.put(`/chat/read/${orderId}`),
};

export default chatApi;


