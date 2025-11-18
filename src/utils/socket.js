// src/utils/socket.js
import { io } from "socket.io-client";

/**
 * Neon Eats Socket Utility
 * ------------------------
 * - Handles delivery partner, restaurant, and customer events.
 * - Auto-reconnects with 5 attempts.
 * - Supports cookie-based auth or token-based auth.
 */

const rawApi = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SOCKET_URL = rawApi.replace(/\/api\/?$/, "");

// --- Create socket instance ---
const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// --- Debugging logs (optional) ---
socket.on("connect", () => console.log("Socket connected:", socket.id));
socket.on("disconnect", (reason) => console.log("Socket disconnected:", reason));
socket.on("connect_error", (err) => console.warn("Socket connect error:", err.message || err));

// --- Connect socket ---
export function connectSocket({ token } = {}) {
  if (socket.connected) return socket;

  if (token) socket.auth = { token };
  else socket.auth = {};

  socket.connect();
  return socket;
}

// --- Disconnect socket ---
export function disconnectSocket() {
  try {
    socket.removeAllListeners();
  } catch (e) {}
  socket.disconnect();
}

// --- Safe emit wrapper ---
export function safeEmit(eventName, payload = {}, ackCb) {
  if (socket && socket.connected) {
    try {
      if (ackCb && typeof ackCb === "function") socket.emit(eventName, payload, ackCb);
      else socket.emit(eventName, payload);
    } catch (err) {
      console.warn("Socket emit error:", err);
    }
  }
}

// --- Event listeners ---
export const on = (eventName, cb) => socket.on(eventName, cb);
export const off = (eventName, cb) => socket.off(eventName, cb);

// --- Delivery partner helpers ---
export const joinDeliveryRoom = (deliveryId) => {
  safeEmit("joinDelivery", { deliveryId });
};

export const sendDriverLocation = (orderId, lat, lng, partnerId) => {
  safeEmit("driver-location", { orderId, lat, lng, partnerId });
};

export const updateDeliveryStatus = (orderId, status) => {
  safeEmit("status-update", { orderId, status });
};

// --- Customer / Restaurant helpers ---
export const joinOrderRoom = (orderId) => {
  safeEmit("join-order", { orderId });
};

export const joinRestaurantRoom = (restaurantId) => {
  safeEmit("joinRestaurant", { restaurantId });
};

export const joinUserRoom = (userId) => {
  safeEmit("joinUser", { userId });
};

export default socket;





