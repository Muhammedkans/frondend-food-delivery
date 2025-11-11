// src/pages/Restaurant/Orders.jsx
import React, { useEffect, useState } from "react";
import RestaurantLayout from "../../layout/RestaurantLayout";
import restaurantApi from "../../api/restaurantApi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await restaurantApi.getProfile(); // assuming profile includes orders for restaurant owner
      setOrders(res.data.restaurant.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await restaurantApi.toggleStatus(orderId, newStatus); // or specific API for updating order status
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return (
      <p className="text-neonGreen text-xl p-6">Loading orders...</p>
    );

  return (
    <RestaurantLayout>
      <div className="p-6 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold text-neonGreen mb-6">
          Incoming Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-gray-300 text-center">No orders yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="p-6 bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transform transition"
              >
                <h2 className="text-xl font-semibold text-neonBlue mb-2">
                  Order #{order._id.substring(0, 6)}
                </h2>
                <p className="text-gray-300 mb-2">
                  Customer: {order.customerName}
                </p>
                <p className="text-gray-300 mb-2">
                  Total: ${order.totalPrice.toFixed(2)}
                </p>
                <p className="text-gray-300 mb-2">
                  Items: {order.items.map((i) => i.name).join(", ")}
                </p>
                <p className="text-neonGreen font-bold mb-4">
                  Status: {order.status}
                </p>

                <div className="flex gap-2">
                  {order.status !== "Preparing" && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, "Preparing")}
                      className="px-3 py-1 bg-neonBlue hover:bg-neonGreen text-gray-900 rounded-xl font-semibold transition"
                    >
                      Mark Preparing
                    </button>
                  )}
                  {order.status !== "Ready" && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, "Ready")}
                      className="px-3 py-1 bg-neonBlue hover:bg-neonGreen text-gray-900 rounded-xl font-semibold transition"
                    >
                      Mark Ready
                    </button>
                  )}
                  {order.status !== "Completed" && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, "Completed")}
                      className="px-3 py-1 bg-neonBlue hover:bg-neonGreen text-gray-900 rounded-xl font-semibold transition"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RestaurantLayout>
  );
};

export default Orders;
