// src/pages/Customer/MyOrders.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import customerApi from "../../api/customerApi";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const { user } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await customerApi.getMyOrders();
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user._id]);

  if (loading) {
    return <div className="text-white text-center mt-10">Loading orders...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-neonGreen">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-300">You have not placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-900 border border-neonGreen/50 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <h2 className="text-xl font-semibold text-white">{order.restaurantName}</h2>
                <p className="text-gray-400 text-sm">Order ID: {order._id}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}{" "}
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                <p className="text-gray-400 text-sm">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      order.status === "Delivered"
                        ? "text-neonGreen"
                        : order.status === "Cancelled"
                        ? "text-red-500"
                        : "text-yellow-400"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
              </div>

              <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
                <p className="text-white font-semibold">Total: ₹{order.totalPrice}</p>
                <Link
                  to={`/customer/order-details/${order._id}`}
                  className="px-4 py-2 bg-neonGreen text-black rounded-xl font-medium hover:bg-neonGreen/80 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;

