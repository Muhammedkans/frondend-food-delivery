// src/api/paymentApi.js
import axiosClient from "./axiosClient";

const paymentApi = {
    // ------------------------------------
    // ✅ CREATE RAZORPAY ORDER
    // ------------------------------------
    createOrder: (data) =>
        axiosClient.post("/payment/order", data),

    // ------------------------------------
    // ✅ VERIFY PAYMENT SIGNATURE
    // ------------------------------------
    verifyPayment: (data) =>
        axiosClient.post("/payment/verify", data),

    // ------------------------------------
    // ✅ PAYMENT FAILED HANDLER
    // ------------------------------------
    paymentFailed: (data) =>
        axiosClient.post("/payment/failed", data),
};

export default paymentApi;
