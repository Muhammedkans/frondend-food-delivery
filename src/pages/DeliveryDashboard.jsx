// src/pages/DeliveryDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api/api";
import { io } from "socket.io-client";
import Loader from "../components/Loader";
import Toast from "../components/Toast";

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // ✅ Connect to socket
    const s = io(import.meta.env.VITE_API_URL);
    setSocket(s);

    // ✅ Join Delivery room
    s.emit("joinDeliveryPartners");

    // ✅ New order assigned live
    s.on("orderAssigned", (order) => {
      setOrders((prev) => [order, ...prev]);
      triggerToast("New delivery assigned!", "success");
    });

    fetchAssignedOrders();

    return () => s.disconnect();
  }, []);

  const triggerToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  // ✅ Fetch all assigned orders
  const fetchAssignedOrders = async () => {
    try {
      const { data } = await api.get("/delivery/orders");
      setOrders(data.orders || []);
    } catch (err) {
      triggerToast("Failed to fetch orders", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Accept Order
  const acceptOrder = async (orderId) => {
    try {
      await api.put(`/delivery/order/${orderId}`, { status: "accepted" });

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "accepted" } : o))
      );

      socket.emit("deliveryStatusUpdate", { orderId, status: "accepted" });
      triggerToast("Order Accepted ✅", "success");
    } catch {
      triggerToast("Failed to accept order", "error");
    }
  };

  // ✅ Mark as Picked
  const markPicked = async (orderId) => {
    try {
      await api.put(`/delivery/order/${orderId}`, { status: "picked" });

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "picked" } : o))
      );

      socket.emit("deliveryStatusUpdate", { orderId, status: "picked" });
      triggerToast("Order Picked ✅", "success");
    } catch {
      triggerToast("Failed to update", "error");
    }
  };

  // ✅ Mark Delivered
  const markDelivered = async (orderId) => {
    try {
      await api.put(`/delivery/order/${orderId}`, { status: "delivered" });

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "delivered" } : o
        )
      );

      socket.emit("deliveryStatusUpdate", { orderId, status: "delivered" });
      triggerToast("Order Delivered ✅", "success");
    } catch {
      triggerToast("Failed to deliver order", "error");
    }
  };

  // ✅ Map Link
  const openMap = (address) => {
    const encoded = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen dark:bg-gray-900 dark:text-gray-200">

      {toast && <Toast message={toast.message} type={toast.type} />}

      <h1 className="text-3xl font-bold mb-6">Delivery Dashboard</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-400">No deliveries assigned yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-5"
            >
              <h3 className="text-xl font-semibold">
                Order #{order._id.slice(-6).toUpperCase()}
              </h3>

              {/* ✅ Restaurant */}
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Restaurant:{" "}
                <span className="font-medium">
                  {order.restaurant?.name}
                </span>
              </p>

              {/* ✅ Customer */}
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Customer: <span className="font-medium">{order.customer?.name}</span>
              </p>

              {/* ✅ Delivery Address */}
              <p className="mt-1 text-sm">
                Address:{" "}
                <span
                  className="cursor-pointer text-blue-500"
                  onClick={() => openMap(order.deliveryAddress)}
                >
                  {order.deliveryAddress}
                </span>
              </p>

              {/* ✅ Status */}
              <p className="mt-2 text-sm">
                Status:{" "}
                <span className="font-semibold text-green-500">
                  {order.status}
                </span>
              </p>

              {/* ✅ Buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                {order.status === "assigned" && (
                  <button
                    onClick={() => acceptOrder(order._id)}
                    className="px-3 py-1 bg-green-600 text-white rounded-full text-sm"
                  >
                    Accept
                  </button>
                )}

                {order.status === "accepted" && (
                  <button
                    onClick={() => markPicked(order._id)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm"
                  >
                    Mark Picked
                  </button>
                )}

                {order.status === "picked" && (
                  <button
                    onClick={() => markDelivered(order._id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
                  >
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;


