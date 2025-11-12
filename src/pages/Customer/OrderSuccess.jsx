// src/pages/Customer/OrderSuccess.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import customerApi from "../../api/customerApi";
import { toast } from "react-hot-toast";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch order details
  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await customerApi.getOrderDetails(orderId);
      setOrder(res.data.order);
    } catch (err) {
      toast.error("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="text-center text-green-400 text-2xl mt-20">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold neon-text mb-4">
          Order not found
        </h2>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-green-500 text-black rounded-lg font-semibold hover:bg-green-600 transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center max-w-lg w-full space-y-6">
        <h1 className="text-5xl font-bold neon-text">🎉 Payment Successful!</h1>
        <p className="text-xl text-green-400 font-semibold">
          Your order has been placed successfully.
        </p>

        <div className="bg-gray-800 p-4 rounded-lg space-y-2">
          <h2 className="text-2xl font-bold neon-text">{order.restaurant.name}</h2>
          {order.items.map((item) => (
            <div key={item.dish._id} className="flex justify-between">
              <span>{item.dish.name} x {item.quantity}</span>
              <span>${item.dish.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between text-xl font-bold neon-text mt-2">
            <span>Total:</span>
            <span>${order.totalPrice}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => navigate("/customer/home")}
            className="px-6 py-3 bg-green-500 text-black font-bold rounded-lg hover:bg-green-600 transition-all"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate("/customer/my-orders")}
            className="px-6 py-3 bg-blue-500 text-black font-bold rounded-lg hover:bg-blue-600 transition-all"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

