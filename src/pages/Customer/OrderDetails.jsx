// src/pages/Customer/OrderDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import customerApi from "../../api/customerApi";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await customerApi.getOrderDetails(orderId);
        setOrder(res.data.order);
      } catch (err) {
        console.error("Error fetching order details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return <div className="text-white text-center mt-10">Loading order details...</div>;
  }

  if (!order) {
    return <div className="text-white text-center mt-10">Order not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-neonGreen">Order Details</h1>

      <div className="bg-gray-900 border border-neonGreen/50 rounded-xl p-6 space-y-4">
        <div className="flex justify-between">
          <p className="text-gray-400">Order ID:</p>
          <p className="text-white font-semibold">{order._id}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-gray-400">Restaurant:</p>
          <p className="text-white font-semibold">{order.restaurantName}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-gray-400">Order Date:</p>
          <p className="text-white font-semibold">
            {new Date(order.createdAt).toLocaleDateString()}{" "}
            {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>

        <div className="flex justify-between">
          <p className="text-gray-400">Status:</p>
          <p
            className={`font-semibold ${
              order.status === "Delivered"
                ? "text-neonGreen"
                : order.status === "Cancelled"
                ? "text-red-500"
                : "text-yellow-400"
            }`}
          >
            {order.status}
          </p>
        </div>

        <hr className="border-gray-700" />

        <div>
          <h2 className="text-xl text-white font-semibold mb-2">Items</h2>
          {order.items.map((item) => (
            <div
              key={item._id}
              className="flex justify-between bg-gray-800 p-3 rounded-lg mb-2"
            >
              <div>
                <p className="text-white font-medium">{item.name}</p>
                <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
              </div>
              <p className="text-neonGreen font-semibold">₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        <hr className="border-gray-700" />

        <div className="flex justify-between text-white font-semibold text-lg">
          <p>Total:</p>
          <p>₹{order.totalPrice}</p>
        </div>

        <div className="mt-4">
          <Link
            to="/customer/my-orders"
            className="px-4 py-2 bg-neonGreen text-black rounded-xl font-medium hover:bg-neonGreen/80 transition"
          >
            Back to My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

