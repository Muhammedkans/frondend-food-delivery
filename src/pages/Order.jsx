// src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "../redux/slices/orderSlice";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import { formatCurrency } from "../utils/formatCurrency";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, loading, error } = useSelector((s) => s.orders);

  const [toast, setToast] = useState(null);

  // ✅ Fetch Orders
  useEffect(() => {
    dispatch(fetchOrders())
      .unwrap()
      .catch((err) => setToast({ type: "error", message: err }));
  }, []);

  // ✅ Display Error Toast
  useEffect(() => {
    if (error) setToast({ type: "error", message: error });
  }, [error]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      {toast && <Toast type={toast.type} message={toast.message} />}

      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        My Orders
      </h1>

      {/* ✅ No Orders */}
      {!orders?.length ? (
        <p className="text-gray-500 dark:text-gray-400">You have no orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl 
              p-5 cursor-pointer transition-all"
              onClick={() => navigate(`/myorder/${order._id}`)}
            >
              {/* ✅ Order ID */}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Order ID: {order._id.slice(-8).toUpperCase()}
              </p>

              {/* ✅ Total */}
              <p className="text-xl font-bold mt-2">
                {formatCurrency(order.totalAmount)}
              </p>

              {/* ✅ Status */}
              <p
                className={`mt-1 font-semibold ${
                  order.status === "pending"
                    ? "text-yellow-500"
                    : order.status === "preparing" ||
                      order.status === "accepted"
                    ? "text-blue-500"
                    : order.status === "out-for-delivery"
                    ? "text-purple-500"
                    : order.status === "delivered"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {order.status.toUpperCase()}
              </p>

              {/* ✅ List of items */}
              <div className="mt-4">
                {order.items.map((item) => (
                  <p
                    key={item.dish._id}
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    {item.quantity} × {item.dish.name}
                  </p>
                ))}
              </div>

              {/* ✅ Order Date */}
              <p className="text-xs text-gray-400 mt-4">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default Orders;







