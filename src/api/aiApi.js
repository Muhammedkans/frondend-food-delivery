// src/api/aiApi.js
import axiosClient from "./axiosClient";

const aiApi = {
    // ----------------------------------------------------
    // ✅ AI CHAT ASSISTANT
    // ----------------------------------------------------
    aiChat: (prompt, orderId = null) =>
        axiosClient.post("/ai/chat", { prompt, orderId }),

    // ----------------------------------------------------
    // ✅ AI FOOD RECOMMENDATION (Mood + Diet + Craving)
    // ----------------------------------------------------
    recommendFood: (mood, diet, craving) =>
        axiosClient.post("/ai/recommend", { mood, diet, craving }),

    // ----------------------------------------------------
    // ✅ AI HEALTHY MEALS (Fitness goals)
    // ----------------------------------------------------
    healthyMeals: (goal) =>
        axiosClient.post("/ai/healthy", { goal }),
};

export default aiApi;
