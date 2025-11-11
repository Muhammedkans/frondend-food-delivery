import { useGetMyOrdersQuery } from "../redux/api/orderApi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MyOrders = () => {
  const { data, isLoading } = useGetMyOrdersQuery();

  const orders = data?.orders || [];

  const statusColors = {
    placed: "text-yellow-400",
    accepted: "text-blue-400",
    picked_up: "text-purple-400",
    delivered: "text-green-400",
    cancelled: "text-red-500",
  };

  if (isLoading) {
    return (
      <div className="text-center text-[#00ff9d] mt-10 text-xl">
        Loading your orders…
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center mt-12 text-gray-400 text-xl">
        No orders found 📦
      </div>
    );
  }

  return (
    <div className="pb-20">
      <h1 className="text-3xl font-bold neon-green mb-6">My Orders</h1>

      <div className="space-y-5">
        {orders.map((order) => (
          <motion.div
            key={order._id}
            whileHover={{ scale: 1.01 }}
            className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(0,255,157,0.1)]"
          >
            {/* Order Header */}
            <div className="flex justify-between items-center">
              <p className="text-xl font-semibold text-[#00ff9d]">
                Order #{order._id.slice(-6)}
              </p>
              <p
                className={`text-sm font-bold ${
                  statusColors[order.status]
                }`}
              >
                {order.status.toUpperCase()}
              </p>
            </div>

            {/* Order Items */}
            <div className="mt-4 space-y-2">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-gray-300 text-sm"
                >
                  <span>
                    {item.dish?.name || "Dish"} × {item.quantity}
                  </span>
                  <span>₹ {item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between mt-4 text-lg font-semibold">
              <span className="text-gray-300">Total</span>
              <span className="text-[#00ff9d]">₹ {order.totalAmount}</span>
            </div>

            {/* Tracking Button */}
            <Link
              to={`/track/${order._id}`}
              className="mt-5 inline-block w-full text-center py-3 rounded-xl bg-[#00ff9d] text-black font-semibold hover:bg-[#00ffc9] transition shadow-[0_0_20px_#00ff9d]"
            >
              Track Order
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;





