// src/pages/RestaurantDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api/api";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import { formatCurrency } from "../utils/formatCurrency";

const RestaurantDashboard = () => {
  const { user } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!user?._id) return;

    // ✅ Connect to socket
    const s = io(import.meta.env.VITE_API_URL);
    setSocket(s);

    // ✅ Join restaurant room
    s.emit("joinRestaurantRoom", user._id);

    // ✅ Fetch all restaurant orders
    fetchRestaurantOrders();

    // ✅ Listen for new orders (socket)
    s.on("newOrder", (order) => {
      setOrders((prev) => [order, ...prev]);
      triggerToast("New order received!", "success");
    });

    return () => s.disconnect();
  }, [user]);

  const triggerToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  // ✅ Fetch Initial Orders
  const fetchRestaurantOrders = async () => {
    try {
      const { data } = await api.get(`/restaurant/orders/${user._id}`);
      setOrders(data.orders || []);
    } catch (err) {
      triggerToast("Failed to fetch orders", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update Order Status
  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/restaurant/order/${orderId}`, { status });

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );

      // ✅ Send update to delivery/customer via socket
      socket.emit("orderStatusUpdated", { orderId, status });

      triggerToast(`Order marked as '${status}'`, "success");
    } catch (err) {
      triggerToast("Failed to update order", "error");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {toast && <Toast message={toast.message} type={toast.type} />}

      <h1 className="text-3xl font-bold mb-6">Restaurant Dashboard</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">
          No orders yet. Wait for customers to place new orders.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5"
            >
              {/* ✅ Order ID */}
              <h3 className="text-lg font-semibold">
                Order #{order._id.slice(-6).toUpperCase()}
              </h3>

              {/* ✅ Customer */}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Customer:{" "}
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {order.customer?.name}
                </span>
              </p>

              {/* ✅ Total */}
              <p className="text-sm mt-2">
                <strong>Total:</strong> {formatCurrency(order.totalAmount)}
              </p>

              {/* ✅ Status */}
              <p className="mt-2 text-sm">
                <strong>Status:</strong>{" "}
                <span className="font-semibold text-blue-500">
                  {order.status}
                </span>
              </p>

              {/* ✅ Action Buttons */}
              <div className="mt-4 flex flex-wrap gap-2">

                {["Accepted", "Preparing", "Ready", "Delivered"].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateOrderStatus(order._id, status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium 
                      ${
                        order.status === status
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700"
                      }
                    `}
                  >
                    {status}
                  </button>
                ))}

              </div>

              {/* ✅ Items List */}
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Items</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  {order.items.map((item) => (
                    <li key={item.dish._id} className="flex justify-between">
                      <span>{item.dish.name}</span>
                      <span>x{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;

