// src/pages/Admin/ManageOrders.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import adminApi from "../../api/adminApi";
import { FaClipboardList } from "react-icons/fa";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await adminApi.getAllOrders(); // Make sure this API exists in adminApi
        setOrders(res.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return <p className="text-neonGreen text-xl p-6">Loading orders...</p>;

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold text-neonGreen mb-6">Manage Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-300 text-center text-xl mt-10">
            No orders yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="p-4 bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transform transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <FaClipboardList className="text-neonBlue text-2xl" />
                  <h2 className="text-lg font-semibold text-neonBlue">
                    Order #{order._id.slice(-6)}
                  </h2>
                </div>

                <p className="text-gray-300">
                  Customer: {order.customer?.name || "N/A"}
                </p>
                <p className="text-gray-300">
                  Restaurant: {order.restaurant?.name || "N/A"}
                </p>
                <p className="text-gray-300">
                  Total: ₹{order.totalPrice.toFixed(2)}
                </p>
                <p
                  className={`mt-2 font-semibold ${
                    order.status === "Delivered"
                      ? "text-neonGreen"
                      : order.status === "Pending"
                      ? "text-yellow-400"
                      : "text-red-500"
                  }`}
                >
                  Status: {order.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageOrders;
