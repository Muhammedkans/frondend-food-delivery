// src/pages/Delivery/Dashboard.jsx
import React, { useEffect, useState } from "react";
import DeliveryLayout from "../../layout/DeliveryLayout";
import deliveryApi from "../../api/deliveryApi";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await deliveryApi.getDashboard();
      if (res.data.success) {
        setActiveOrders(res.data.data.activeOrders);
        setCompletedOrders(res.data.data.completedOrders);
        setEarnings(res.data.data.earnings);
        setIsOnline(res.data.data.isOnline);
      } else {
        toast.error("Failed to load dashboard");
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const toggleOnline = async () => {
    try {
      const res = await deliveryApi.toggleOnlineStatus();
      if (res.data.success) {
        setIsOnline(res.data.isOnline);
        toast.success(res.data.message);
      }
    } catch (err) {
      console.error("Toggle Online Error:", err);
      toast.error("Could not change online status");
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      if (status === "Picked Up") {
        await deliveryApi.markPickedUp(orderId);
      } else if (status === "Delivered") {
        await deliveryApi.markDelivered(orderId);
      }
      toast.success("Order status updated!");
      fetchDashboard();
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Could not update order status.");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading)
    return <p className="text-neonGreen text-xl p-6">Loading dashboard...</p>;

  return (
    <DeliveryLayout>
      <div className="p-6 bg-gray-900 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-neonGreen">
            Delivery Dashboard
          </h1>
          <button
            onClick={toggleOnline}
            className={`px-4 py-2 rounded-xl font-bold transition ${
              isOnline ? "bg-neonGreen text-black" : "bg-neonBlue text-white"
            }`}
          >
            {isOnline ? "Go Offline" : "Go Online"}
          </button>
        </div>

        <div className="flex gap-6 mb-6">
          <div className="bg-gray-800 p-4 rounded-xl flex-1 text-center">
            <p className="text-gray-400">Active Orders</p>
            <p className="text-neonGreen text-2xl font-bold">{activeOrders.length}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl flex-1 text-center">
            <p className="text-gray-400">Completed Orders</p>
            <p className="text-neonGreen text-2xl font-bold">{completedOrders}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl flex-1 text-center">
            <p className="text-gray-400">Earnings</p>
            <p className="text-neonGreen text-2xl font-bold">₹{earnings}</p>
          </div>
        </div>

        {activeOrders.length === 0 ? (
          <p className="text-gray-300 text-xl">No active orders at the moment.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOrders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-700"
              >
                <h2 className="text-neonGreen font-bold text-xl mb-2">
                  Order #{order._id.slice(-6)}
                </h2>
                <p className="text-gray-200 mb-1">Customer: {order.customer.name}</p>
                <p className="text-gray-200 mb-1">Restaurant: {order.restaurant.name}</p>
                <p className="text-gray-200 mb-1">Total: ₹{order.total.toFixed(2)}</p>
                <p className="text-gray-200 mb-3">
                  Status: <span className="font-semibold">{order.status}</span>
                </p>

                <div className="flex gap-2">
                  {order.status === "accepted" && (
                    <button
                      onClick={() => handleStatusChange(order._id, "Picked Up")}
                      className="flex-1 py-2 bg-neonBlue hover:bg-neonGreen rounded-xl font-bold text-gray-900 transition"
                    >
                      Pick Up
                    </button>
                  )}
                  {order.status === "picked_up" && (
                    <button
                      onClick={() => handleStatusChange(order._id, "Delivered")}
                      className="flex-1 py-2 bg-neonGreen hover:bg-neonBlue rounded-xl font-bold text-gray-900 transition"
                    >
                      Deliver
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DeliveryLayout>
  );
};

export default Dashboard;

