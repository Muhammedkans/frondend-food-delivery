// src/pages/Customer/OrderTracking.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import orderApi from "../../api/orderApi";

const steps = ["Order Placed", "Preparing", "Out for Delivery", "Delivered"];

const OrderTracking = () => {
  const { orderId } = useParams();
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const res = await orderApi.getOrder(orderId);
        // Assuming backend returns status index (0-3)
        setStatusIndex(res.data.order.statusIndex);
      } catch (error) {
        console.error("Error fetching order status:", error);
      }
    };

    fetchOrderStatus();

    // Optional: Poll every 10 seconds
    const interval = setInterval(fetchOrderStatus, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold neon-text mb-8">Track Your Order</h1>
      <div className="w-full max-w-2xl flex flex-col space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                index <= statusIndex ? "bg-green-500 border-green-400" : "border-gray-700"
              }`}
            >
              {index <= statusIndex ? "✔" : index + 1}
            </div>
            <div className="ml-4 text-lg font-semibold">{step}</div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-gray-400 text-center">
        Your order is on its way! Stay tuned for live updates.
      </p>
    </div>
  );
};

export default OrderTracking;
