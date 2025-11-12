// src/pages/Customer/OrderTracking.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import customerApi from "../../api/customerApi"; // ✅ Correct import

const steps = ["Order Placed", "Preparing", "Out for Delivery", "Delivered"];

const OrderTracking = () => {
  const { orderId } = useParams();
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        // Using active order as sample (you can replace with specific order if backend supports)
        const res = await customerApi.getActiveOrder();

        if (res?.data?.order?.statusIndex !== undefined) {
          setStatusIndex(res.data.order.statusIndex);
        }
      } catch (error) {
        console.error("Error fetching order status:", error);
      }
    };

    fetchOrderStatus();

    // auto-refresh every 10 sec
    const interval = setInterval(fetchOrderStatus, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <div className="min-h-screen bg-[#060606] text-white p-8 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold mb-10 bg-linear-to-r from-[#00FFAA] to-[#00C8FF] bg-clip-text text-transparent animate-pulse">
        🚀 Track Your Order
      </h1>

      <div className="w-full max-w-3xl flex flex-col space-y-10 relative">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center relative">
            {/* --- Step Circle --- */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-500 ${
                index <= statusIndex
                  ? "bg-linear-to-br from-[#00FFAA] to-[#00C8FF] text-black border-transparent shadow-[0_0_25px_#00FFAA] glow-animate"
                  : "border-gray-700 bg-[#1A1A1A] text-gray-500"
              }`}
            >
              {index <= statusIndex ? "✔" : index + 1}
            </div>

            {/* --- Connecting Line --- */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-[3px] mx-4 rounded-full transition-all duration-500 ${
                  index < statusIndex
                    ? "bg-linear-to-r from-[#00FFAA] to-[#00C8FF] shadow-[0_0_20px_#00FFAA]"
                    : "bg-gray-800"
                }`}
              ></div>
            )}

            {/* --- Step Text --- */}
            <div
              className={`text-lg font-semibold transition-all duration-500 ${
                index <= statusIndex
                  ? "text-[#00FFAA] drop-shadow-[0_0_5px_#00C8FF]"
                  : "text-gray-400"
              }`}
            >
              {step}
            </div>
          </div>
        ))}

        {/* --- Moving Delivery Icon --- */}
        <div
          className="absolute -top-8 left-0 transition-all duration-700 ease-in-out"
          style={{
            transform: `translateX(calc(${statusIndex * 25}%))`,
          }}
        >
          <div className="text-4xl animate-bounce">🛵</div>
        </div>
      </div>

      <p className="mt-12 text-gray-400 text-center text-lg italic">
        Your order is on its way... stay tuned for live neon updates ⚡
      </p>
    </div>
  );
};

export default OrderTracking;
