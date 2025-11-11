// src/utils/socket.js
import { io } from "socket.io-client";

// Backend URL from .env
const SOCKET_URL = import.meta.env.VITE_API_URL.replace("/api", "");

// ✅ Initialize Socket.io
const socket = io(SOCKET_URL, {
  withCredentials: true, // for cookie-based auth
  autoConnect: false,    // connect manually when needed
});

// Optional: Event listeners for debug
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("⚠️ Socket disconnected");
});

export default socket;
