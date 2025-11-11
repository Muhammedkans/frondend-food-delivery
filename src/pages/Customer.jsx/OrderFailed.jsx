// src/pages/Customer/OrderFailed.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const OrderFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center max-w-lg w-full space-y-6">
        <h1 className="text-5xl font-bold text-red-500 neon-text">❌ Payment Failed!</h1>
        <p className="text-xl text-red-400 font-semibold">
          Oops! Your payment could not be processed.
        </p>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => navigate("/customer/checkout")}
            className="px-6 py-3 bg-green-500 text-black font-bold rounded-lg hover:bg-green-600 transition-all"
          >
            Retry Payment
          </button>
          <button
            onClick={() => navigate("/customer/home")}
            className="px-6 py-3 bg-blue-500 text-black font-bold rounded-lg hover:bg-blue-600 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFailed;
