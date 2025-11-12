// src/pages/Customer/Chat.jsx
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import chatApi from "../../api/chatApi"; // ✅ For REST fallback

// ✅ Backend URL
const SOCKET_URL = import.meta.env.VITE_API_URL;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Later, you’ll get orderId dynamically (from props or URL params)
  const orderId = "sampleOrder123";

  // ✅ Auto scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Load chat history from backend (via REST)
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await chatApi.getChatHistory(orderId);
        if (res?.data?.messages) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error("❌ Error loading chat history:", err);
      }
    };
    fetchChatHistory();
  }, []);

  // ✅ Setup secure Socket.io connection
  useEffect(() => {
    // 🔒 IMPORTANT:
    // No need to manually attach token — browser automatically sends
    // HTTP-only cookie (with credentials)
    const newSocket = io(SOCKET_URL, {
      withCredentials: true, // ✅ allow cookie-based auth
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Connected to Chat Server:", newSocket.id);
    });

    newSocket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on("disconnect", () => {
      console.log("⚠️ Disconnected from Chat Server");
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // ✅ Send message
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const messageData = {
      content: input.trim(),
      sender: "customer",
      orderId,
      createdAt: new Date(),
    };

    // Emit message to server
    socket?.emit("sendMessage", messageData);

    // Optimistic UI update
    setMessages((prev) => [...prev, messageData]);
    setInput("");

    // Save message in DB (backup REST)
    try {
      await chatApi.sendMessage(messageData);
    } catch (err) {
      console.error("❌ Error saving message:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 bg-gray-800 border-b border-neonGreen/50 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neonGreen">Chat Support</h1>
        <p className="text-gray-400 text-sm">Live with Restaurant / Delivery</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow-sm ${
              msg.sender === "customer"
                ? "ml-auto bg-neonGreen text-black"
                : "mr-auto bg-gray-800 text-white"
            }`}
          >
            <p className="text-sm md:text-base">{msg.content}</p>
            <span className="text-xs text-gray-400 mt-1 block text-right">
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 bg-gray-800 border-t border-neonGreen/50 flex space-x-3">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-3 bg-gray-900 border border-neonGreen/50 rounded-2xl text-white focus:outline-none focus:border-neonGreen"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="px-5 py-2 bg-neonGreen rounded-2xl font-semibold text-black hover:bg-neonGreen/80 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;



