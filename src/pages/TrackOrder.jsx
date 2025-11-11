import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useGetActiveOrderQuery } from "../redux/api/orderApi";
import { motion } from "framer-motion";

const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
});

const TrackOrder = () => {
  const { orderId } = useParams();

  const { data, isLoading } = useGetActiveOrderQuery();
  const [liveOrder, setLiveOrder] = useState(null);

  useEffect(() => {
    if (data?.order) {
      setLiveOrder(data.order);
    }
  }, [data]);

  // ✅ Socket room join/leave
  useEffect(() => {
    socket.emit("join_room", orderId);

    socket.on("order_update", (updatedOrder) => {
      setLiveOrder(updatedOrder);
    });

    return () => {
      socket.emit("leave_room", orderId);
      socket.off("order_update");
    };
  }, [orderId]);

  if (isLoading || !liveOrder) {
    return (
      <div className="text-center mt-10 text-[#00ff9d]">
        Loading order tracking…
      </div>
    );
  }

  const statusSteps = [
    { key: "placed", label: "Order Placed" },
    { key: "accepted", label: "Restaurant Accepted" },
    { key: "picked_up", label: "Out for Delivery" },
    { key: "delivered", label: "Delivered" },
  ];

  const currentStatusIndex = statusSteps.findIndex(
    (s) => s.key === liveOrder.status
  );

  return (
    <div className="pb-24">
      <h1 className="text-3xl font-bold neon-green mb-6">
        Tracking Order #{liveOrder._id.slice(-6)}
      </h1>

      {/* Status Timeline */}
      <div className="space-y-6">
        {statusSteps.map((step, index) => (
          <motion.div
            key={step.key}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div
              className={`h-6 w-6 rounded-full border-2 ${
                index <= currentStatusIndex
                  ? "bg-[#00ff9d] border-[#00ff9d]"
                  : "border-gray-600"
              }`}
            ></div>

            <p
              className={`text-lg ${
                index <= currentStatusIndex ? "text-[#00ff9d]" : "text-gray-400"
              }`}
            >
              {step.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Delivery Details */}
      <div className="mt-8 bg-white/5 p-5 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(0,255,157,0.1)]">
        <h2 className="text-xl font-bold text-[#00ff9d] mb-3">
          Delivery Details
        </h2>

        <p className="text-gray-300">
          <span className="font-semibold text-gray-400">Address:</span>{" "}
          {liveOrder.deliveryAddress}
        </p>

        <p className="text-gray-300 mt-2">
          <span className="font-semibold text-gray-400">Payment:</span>{" "}
          {liveOrder.paymentMethod}
        </p>
      </div>

      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        className="w-full mt-8 py-3 bg-[#00ff9d] text-black font-semibold rounded-xl shadow-[0_0_20px_#00ff9d]"
      >
        Chat with Support / Delivery
      </motion.button>
    </div>
  );
};

export default TrackOrder;
