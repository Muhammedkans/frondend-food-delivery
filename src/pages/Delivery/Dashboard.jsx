// src/pages/Delivery/Dashboard.jsx
import React, { useEffect, useState } from "react";
import DeliveryLayout from "../../layout/DeliveryLayout";
import deliveryApi from "../../api/deliveryApi";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await deliveryApi.getAssignedOrders(); // API to fetch assigned orders
      setOrders(res.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await deliveryApi.updateOrderStatus(orderId, status);
      toast.success("Order status updated!");
      fetchOrders();
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Could not update order status.");
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
    <DeliveryLayout>
      <div className="p-6 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold text-neonGreen mb-6">
          Delivery Dashboard
        </h1>

        {orders.length === 0 ? (
          <p className="text-gray-300 text-xl">
            No assigned orders at the moment.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-700"
              >
                <h2 className="text-neonGreen font-bold text-xl mb-2">
                  Order #{order._id.slice(-6)}
                </h2>
                <p className="text-gray-200 mb-1">
                  Customer: {order.customer.name}
                </p>
                <p className="text-gray-200 mb-1">
                  Restaurant: {order.restaurant.name}
                </p>
                <p className="text-gray-200 mb-1">
                  Total: ₹{order.total.toFixed(2)}
                </p>
                <p className="text-gray-200 mb-3">
                  Status:{" "}
                  <span className="font-semibold">{order.status}</span>
                </p>

                <div className="flex gap-2">
                  {order.status !== "Delivered" && (
                    <button
                      onClick={() =>
                        handleStatusChange(order._id, "Picked Up")
                      }
                      className="flex-1 py-2 bg-neonBlue hover:bg-neonGreen rounded-xl font-bold text-gray-900 transition"
                    >
                      Pick Up
                    </button>
                  )}
                  {order.status === "Picked Up" && (
                    <button
                      onClick={() =>
                        handleStatusChange(order._id, "Delivered")
                      }
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
