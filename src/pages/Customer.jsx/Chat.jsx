// src/pages/Customer/Chat.jsx
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { getCookie } from "../../utils/helpers";

const SOCKET_URL = import.meta.env.VITE_API_URL; // Your backend URL

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new message arrives
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    // Connect socket with authentication token from cookies
    const token = getCookie("token");
    const newSocket = io(SOCKET_URL, {
      auth: { token },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to chat server:", newSocket.id);
    });

    // Listen to incoming messages
    newSocket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const messageData = {
      content: input,
      sender: "customer",
      createdAt: new Date(),
    };

    // Emit message to server
    socket.emit("sendMessage", messageData);

    // Optimistically update UI
    setMessages((prev) => [...prev, messageData]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="p-4 bg-gray-800 border-b border-neonGreen/50 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neonGreen">Customer Chat</h1>
        <p className="text-gray-400 text-sm">Support & Restaurant Chat</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xs md:max-w-md p-3 rounded-xl ${
              msg.sender === "customer"
                ? "bg-neonGreen text-black self-end"
                : "bg-gray-800 text-white self-start"
            }`}
          >
            <p>{msg.content}</p>
            <span className="text-xs text-gray-400 mt-1 block text-right">
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-800 border-t border-neonGreen/50 flex space-x-2">
        <input
          type="text"
          className="flex-1 p-3 rounded-xl bg-gray-900 border border-neonGreen/50 text-white focus:outline-none focus:border-neonGreen"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-neonGreen rounded-xl font-semibold text-black hover:bg-neonGreen/80 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

