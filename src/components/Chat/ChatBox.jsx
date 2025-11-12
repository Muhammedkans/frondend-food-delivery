import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Message from "../Message";

const socket = io(import.meta.env.VITE_API_URL); // Connect to backend

const ChatBox = ({ currentUserId, chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      if (message.chatId === chatId) {
        setMessages((prev) => [...prev, message]);
      }
    });
  }, [chatId]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      chatId,
      sender: currentUserId,
      text: newMessage,
      createdAt: new Date(),
    };

    socket.emit("sendMessage", messageData); // Send to server
    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full max-h-[500px] bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-lg">
      <div className="flex-1 overflow-y-auto mb-3">
        {messages.map((msg, idx) => (
          <div key={idx} ref={scrollRef}>
            <Message message={msg} currentUserId={currentUserId} />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 rounded-xl px-4 py-2 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-green-400 text-gray-900 px-4 py-2 rounded-xl font-semibold hover:bg-green-500 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;

