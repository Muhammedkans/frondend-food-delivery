import { useEffect, useState } from "react";
import axios from "axios";
import { FiTrendingUp, FiClock, FiMapPin } from "react-icons/fi";

const DeliveryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState(0);

  // ✅ FETCH ALL COMPLETED ORDERS
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/delivery/orders`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FETCH EARNINGS
  const fetchEarnings = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/delivery/earnings`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setEarnings(res.data.earnings);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchEarnings();
  }, []);

  return (
    <div className="min-h-screen bg-black px-6 py-8">
      <div className="max-w-5xl mx-auto">

        {/* ✅ HEADER */}
        <h1 className="text-3xl font-bold text-neonPink mb-6 text-center">
          Delivery History 📦
        </h1>

        {/* ✅ EARNINGS CARD */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4">
            <FiTrendingUp className="text-neonGreen text-4xl" />
            <div>
              <p className="text-gray-400">Total Earnings</p>
              <h2 className="text-3xl font-bold text-neonGreen">
                ₹{earnings}
              </h2>
            </div>
          </div>
        </div>

        {/* ✅ ORDERS LIST */}
        <h2 className="text-2xl font-bold text-neonYellow mb-4">
          Completed Deliveries
        </h2>

        {orders.length === 0 ? (
          <div className="glass-card p-6 rounded-2xl text-center text-gray-400">
            No completed deliveries yet.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="glass-card p-6 rounded-2xl hover:scale-[1.02] transition-all"
              >
                {/* ✅ Restaurant */}
                <div className="flex items-center gap-2 mb-2 text-neonBlue">
                  <FiMapPin />
                  <p className="text-lg font-semibold">
                    {order.restaurant.restaurantDetails.restaurantName}
                  </p>
                </div>

                {/* ✅ Customer */}
                <p className="text-neonGreen text-sm">
                  Delivered to: {order.customer.name}
                </p>

                {/* ✅ Time */}
                <div className="flex items-center gap-2 text-neonPink mt-1">
                  <FiClock />
                  <p className="text-sm">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* ✅ Price */}
                <p className="text-neonYellow font-bold mt-2 text-lg">
                  ₹{order.totalAmount}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default DeliveryOrders;
