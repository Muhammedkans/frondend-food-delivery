import React, { useEffect, useState } from "react";
import deliveryApi from "../../api/deliveryApi";
import { toast } from "react-toastify";
import LiveTracking from "./LiveTracking";

const Dashboard = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [rating, setRating] = useState(4.8);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch Dashboard Data
  const fetchDashboard = async () => {
    try {
      const res = await deliveryApi.getDashboard();

      if (res?.data?.success) {
        const {
          activeOrders,
          completedOrders,
          earnings,
          todayEarnings,
          rating,
          isOnline,
        } = res.data.data;

        setActiveOrders(activeOrders || []);
        setCompletedOrders(completedOrders || 0);
        setEarnings(earnings || 0);
        setTodayEarnings(todayEarnings || 0);
        setRating(rating || 4.8);
        setIsOnline(isOnline || false);
      } else {
        toast.error("Failed to load dashboard");
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Online / Offline
  const toggleOnline = async () => {
    try {
      const res = await deliveryApi.toggleOnlineStatus();
      if (res?.data?.success) {
        setIsOnline(res.data.isOnline);
        toast.success(res.data.message);
      }
    } catch (err) {
      console.error("Toggle Online Error:", err);
      toast.error("Could not change online status");
    }
  };

  // Change Order Status
  const handleStatusChange = async (orderId, status) => {
    try {
      if (status === "picked_up") await deliveryApi.markPickedUp(orderId);
      if (status === "delivered") await deliveryApi.markDelivered(orderId);

      toast.success("Order status updated!");
      fetchDashboard();
    } catch (error) {
      console.error("Status Update Error:", error);
      toast.error("Could not update status");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <p className="text-neonGreen text-xl p-6">Loading dashboard...</p>
    );

  const activeOrderId =
    activeOrders.length > 0 ? activeOrders[0]._id : null;

  return (
    <div className="p-6 bg-gray-900 min-h-screen">

      {/* Live Tracking */}
      <LiveTracking isOnline={isOnline} orderId={activeOrderId} />

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-neonGreen tracking-wide">
          Delivery Partner Dashboard
        </h1>

        <button
          onClick={toggleOnline}
          className={`px-5 py-2 rounded-xl font-bold shadow-lg transition ${
            isOnline
              ? "bg-neonGreen text-black"
              : "bg-neonBlue text-white"
          }`}
        >
          {isOnline ? "Go Offline" : "Go Online"}
        </button>
      </div>

      {/* Main Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <Card title="Active Orders" value={activeOrders.length} />
        <Card title="Completed" value={completedOrders} />
        <Card title="Earnings" value={`₹${earnings}`} />
        <Card title="Today's Earnings" value={`₹${todayEarnings}`} />
      </div>

      {/* Secondary Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <Card title="Rating" value={`${rating} ⭐`} />
        <Card title="Status" value={isOnline ? "Online" : "Offline"} />
      </div>

      {/* Orders Section */}
      {activeOrders.length === 0 ? (
        <p className="text-gray-300 text-xl">
          No active orders at the moment.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              handleStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-700 text-center">
    <p className="text-gray-400 text-sm">{title}</p>
    <p className="text-neonGreen text-3xl font-bold tracking-wide mt-2">
      {value}
    </p>
  </div>
);

const OrderCard = ({ order, handleStatusChange }) => (
  <div className="bg-gray-800 p-5 rounded-2xl shadow-xl border border-gray-700">
    <h2 className="text-neonGreen font-bold text-xl mb-3">
      Order #{order._id.slice(-6)}
    </h2>

    <p className="text-gray-200 mb-1">
      Customer: <span className="font-semibold">{order.customer?.name}</span>
    </p>
    <p className="text-gray-200 mb-1">
      Restaurant:{" "}
      <span className="font-semibold">{order.restaurant?.name}</span>
    </p>
    <p className="text-gray-200 mb-3">Total: ₹{order.total}</p>

    <div className="flex gap-2">
      {order.status === "accepted" && (
        <button
          onClick={() => handleStatusChange(order._id, "picked_up")}
          className="flex-1 py-2 bg-neonBlue hover:bg-neonGreen rounded-xl font-bold text-black transition"
        >
          Pick Up
        </button>
      )}

      {order.status === "picked_up" && (
        <button
          onClick={() => handleStatusChange(order._id, "delivered")}
          className="flex-1 py-2 bg-neonGreen hover:bg-neonBlue rounded-xl font-bold text-black transition"
        >
          Deliver
        </button>
      )}
    </div>
  </div>
);

export default Dashboard;








