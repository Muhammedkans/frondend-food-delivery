// src/pages/Customer/Payment.jsx
import React, { useEffect, useState } from "react";
import paymentApi from "../../api/paymentApi";
import customerApi from "../../api/customerApi";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const Payment = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams(); // Assuming orderId passed in URL
  const navigate = useNavigate();

  // ✅ Fetch Order Details
  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await customerApi.getOrderDetails(orderId);
      setOrder(res.data.order);
    } catch (err) {
      toast.error("Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  // ✅ Trigger Razorpay Payment
  const handlePayment = async () => {
    try {
      const res = await paymentApi.createOrder({ amount: order.totalPrice * 100 });
      const { orderId: razorOrderId, key } = res.data;

      const options = {
        key,
        amount: order.totalPrice * 100,
        currency: "INR",
        name: "Food Delivery App",
        description: "Order Payment",
        order_id: razorOrderId,
        handler: async function (response) {
          try {
            await paymentApi.verifyPayment(response);
            await customerApi.markOrderPaid(order._id); // mark order as paid
            toast.success("Payment successful!");
            navigate(`/order-success/${order._id}`);
          } catch (err) {
            toast.error("Payment verification failed");
            navigate(`/order-failed/${order._id}`);
          }
        },
        theme: {
          color: "#00FF7F", // Neon Green
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Payment initiation failed");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-green-400 text-2xl mt-20">
        Loading Payment...
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
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold neon-text mb-6 text-center">
        Complete Payment
      </h1>

      <div className="max-w-3xl mx-auto bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
        <h2 className="text-2xl font-bold mb-3 neon-text">Order Summary</h2>
        {order.items.map((item) => (
          <div
            key={item.dish._id}
            className="flex justify-between bg-gray-800 p-3 rounded-lg"
          >
            <span>{item.dish.name} x {item.quantity}</span>
            <span>${item.dish.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between text-xl font-bold neon-text mt-4">
          <span>Total Amount</span>
          <span>${order.totalPrice}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-6 flex justify-center">
        <button
          onClick={handlePayment}
          className="px-8 py-4 bg-green-500 text-black font-bold rounded-lg hover:bg-green-600 transition-all"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Payment;


