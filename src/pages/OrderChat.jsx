import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import {
  useGetChatHistoryQuery,
  useSendChatMessageMutation,
  useSendAIMessageMutation,
} from "../redux/api/chatApi";
import { motion } from "framer-motion";

const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
});

const OrderChat = () => {
  const { orderId } = useParams();
  const chatEndRef = useRef(null);

  const { data, isLoading, refetch } = useGetChatHistoryQuery(orderId);
  const [sendMessage] = useSendChatMessageMutation();
  const [sendAI] = useSendAIMessageMutation();

  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [messages, setMessages] = useState([]);

  // ✅ Load messages initially
  useEffect(() => {
    if (data?.messages) {
      setMessages(data.messages);
    }
  }, [data]);

  // ✅ Socket.io setup
  useEffect(() => {
    socket.emit("join_room", orderId);

    socket.on("new_message", (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socket.emit("leave_room", orderId);
      socket.off("new_message");
    };
  }, [orderId]);

  // ✅ Auto-scroll
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!message && !imageFile) return;

    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("message", message);
    formData.append("receiver", "support"); // You can change based on roles

    if (imageFile) {
      formData.append("image", imageFile);
    }

    await sendMessage(formData);
    setMessage("");
    setImageFile(null);
  };

  const handleAIReply = async () => {
    if (!message) return;

    await sendAI({ orderId, message });
    setMessage("");
  };

  if (isLoading)
    return (
      <p className="text-center text-[#00ff9d] text-xl mt-12">Loading chat…</p>
    );

  return (
    <div className="flex flex-col h-full pb-28">
      {/* ✅ Title */}
      <h1 className="text-3xl font-bold neon-green mb-6">Order Chat</h1>

      {/* ✅ Chat Box */}
      <div className="flex-1 overflow-y-auto space-y-6 p-4 rounded-2xl bg-white/5 border border-white/10 shadow-[0_0_25px_rgba(0,255,157,0.15)]">
        {messages.map((msg) => {
          const isMe = msg.sender?._id === msg.receiver?._id; // AI or self

          return (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[75%] p-3 rounded-2xl backdrop-blur-md border ${
                isMe
                  ? "ml-auto bg-[#00ff9d]/20 border-[#00ff9d]"
                  : "bg-white/10 border-white/20"
              }`}
            >
              {/* ✅ TEXT MESSAGE */}
              {msg.messageType === "text" && (
                <p className="text-gray-200">{msg.message}</p>
              )}

              {/* ✅ IMAGE MESSAGE */}
              {msg.messageType === "image" && (
                <img
                  src={msg.imageUrl}
                  alt="Chat file"
                  className="w-48 rounded-xl"
                />
              )}

              {/* ✅ AI MESSAGE */}
              {msg.messageType === "ai" && (
                <p className="text-[#00ff9d] font-semibold">{msg.message}</p>
              )}

              {/* Sender Info */}
              <p className="text-xs text-gray-400 mt-2">
                {msg.sender?.role || "User"}
              </p>
            </motion.div>
          );
        })}

        <div ref={chatEndRef}></div>
      </div>

      {/* ✅ Chat Input */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black shadow-lg">
        <div className="flex items-center gap-3">
          {/* Upload Image */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="chatImage"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <label
            htmlFor="chatImage"
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl cursor-pointer hover:bg-white/20 transition"
          >
            📎
          </label>

          {/* Message Input */}
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
            placeholder="Type your message..."
          />

          {/* Send Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-[#00ff9d] text-black font-semibold rounded-xl"
            onClick={handleSend}
          >
            Send
          </motion.button>

          {/* ✅ AI REPLY BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-[#00ff9d]/30 text-[#00ff9d] font-semibold border border-[#00ff9d] rounded-xl"
            onClick={handleAIReply}
          >
            AI
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default OrderChat;
