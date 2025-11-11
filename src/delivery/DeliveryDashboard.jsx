import { useEffect, useState } from "react";
import axios from "axios";
import { FiPower, FiClock, FiMapPin, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const DeliveryDashboard = () => {
  const navigate = useNavigate();

  const [online, setOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  // ✅ FETCH ACTIVE ORDER
  const fetchActiveOrder = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/delivery/active-order`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setActiveOrder(res.data.order);
      }
    } catch (error) {
      console.log("Active Order Error:", error);
    }
  };

  // ✅ TOGGLE ONLINE / OFFLINE
  const toggleOnline = async () => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/delivery/toggle-online`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setOnline(res.data.isOnline);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ ACCEPT ORDER
  const acceptOrder = async (orderId) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/delivery/accept/${orderId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        fetchActiveOrder();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ COMPLETE ORDER
  const completeOrder = async (orderId) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/delivery/complete/${orderId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setActiveOrder(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchActiveOrder();
  }, []);

  return (
    <div className="min-h-screen bg-black px-6 py-8">
      <div className="max-w-4xl mx-auto">

        {/* ✅ HEADER */}
        <h1 className="text-3xl font-bold text-neonPink text-center mb-6">
          Delivery Partner Dashboard 🚴‍♂️
        </h1>

        {/* ✅ ONLINE / OFFLINE TOGGLE */}
        <div className="glass-card p-6 rounded-2xl flex justify-between items-center">
          <h2 className="text-xl text-gray-300">Status:</h2>

          <button
            onClick={toggleOnline}
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              online
                ? "bg-neonGreen text-black"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            {loading ? "Updating..." : online ? "ONLINE" : "OFFLINE"}
          </button>
        </div>

        {/* ✅ ACTIVE ORDER SECTION */}
        <div className="mt-6">
          <h3 className="text-2xl font-bold text-neonYellow mb-3">
            Active Delivery
          </h3>

          {!activeOrder ? (
            <div className="glass-card p-6 rounded-2xl text-gray-400 text-center">
              No active orders currently
            </div>
          ) : (
            <div className="glass-card p-6 rounded-2xl space-y-4">

              {/* ✅ Restaurant */}
              <div className="flex items-center gap-3 text-neonBlue">
                <FiMapPin />
                <p className="text-lg">
                  Pickup: {activeOrder.restaurant.restaurantDetails.restaurantName}
                </p>
              </div>

              {/* ✅ Customer */}
              <div className="flex items-center gap-3 text-neonGreen">
                <FiUser />
                <p className="text-lg">
                  Deliver to: {activeOrder.customer.name}
                </p>
              </div>

              {/* ✅ Status */}
              <div className="flex items-center gap-3 text-neonPink">
                <FiClock />
                <p>Status: {activeOrder.status}</p>
              </div>

              {/* ✅ Buttons */}
              {activeOrder.status === "placed" && (
                <button
                  onClick={() => acceptOrder(activeOrder._id)}
                  className="w-full bg-neonGreen text-black py-3 rounded-xl font-bold hover:opacity-80"
                >
                  ACCEPT ORDER
                </button>
              )}

              {activeOrder.status === "picked_up" && (
                <button
                  onClick={() => completeOrder(activeOrder._id)}
                  className="w-full bg-neonPink text-black py-3 rounded-xl font-bold hover:opacity-80"
                >
                  COMPLETE DELIVERY
                </button>
              )}

              {activeOrder.status !== "placed" &&
                activeOrder.status !== "picked_up" && (
                  <p className="text-gray-300 text-center">
                    Delivery In Progress...
                  </p>
                )}
            </div>
          )}
        </div>

        {/* ✅ LOGOUT */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => {
              axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/logout`,
                {},
                { withCredentials: true }
              );
              navigate("/delivery/login");
            }}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 rounded-xl text-white hover:bg-red-700"
          >
            <FiPower /> Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeliveryDashboard;
