import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import API from '../api/api';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL;

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '1rem',
  overflow: 'hidden',
};

const OrderTracking = () => {
  const { id } = useParams(); // Order ID from URL
  const { userInfo } = useSelector(state => state.user);

  const [order, setOrder] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (!userInfo) return;

    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);
        setOrderStatus(data.status);
        setDeliveryLocation(data.deliveryBoy?.location || null);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Socket.io setup for live updates
    const socket = io(SOCKET_SERVER_URL, { transports: ['websocket'] });
    socket.emit('joinOrder', id);

    socket.on('statusUpdate', (data) => setOrderStatus(data.status));
    socket.on('updateLocation', (location) => setDeliveryLocation(location));

    return () => socket.disconnect();
  }, [id, userInfo]);

  // Redirect if user not logged in
  if (!userInfo) return <Navigate to="/login" />;

  if (loading)
    return <p className="text-center mt-10 text-gray-600 text-lg animate-pulse">Loading your order...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500 text-lg">{error}</p>;
  if (!order)
    return <p className="text-center mt-10 text-gray-600 text-lg">Order not found.</p>;

  // Access control
  const isCustomerAllowed = userInfo.role === 'customer' && order.userId === userInfo._id;
  const isRestaurantAllowed = userInfo.role === 'restaurant' && order.restaurantId?._id === userInfo._id;
  const isDeliveryAllowed = userInfo.role === 'driver' && order.deliveryBoyId?._id === userInfo._id;

  if (!isCustomerAllowed && !isRestaurantAllowed && !isDeliveryAllowed) {
    return <p className="text-center mt-10 text-red-500 text-lg">You are not authorized to view this order.</p>;
  }

  // Status color based on current status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'preparing':
        return 'bg-yellow-100 text-yellow-600';
      case 'on the way':
        return 'bg-blue-100 text-blue-600';
      case 'delivered':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-gray-800 mb-10 text-center"
        >
          🚚 Live Order Tracking
        </motion.h1>

        {/* Order Info Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-gray-100 mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-gray-700 text-lg">
                <strong>Restaurant:</strong> {order.restaurantId?.name}
              </p>
              <p className="text-gray-700 text-lg">
                <strong>Order ID:</strong> #{order._id.slice(-6).toUpperCase()}
              </p>
            </div>

            <div
              className={`px-4 py-2 rounded-full text-sm font-semibold uppercase ${getStatusColor(orderStatus)}`}
            >
              {orderStatus}
            </div>
          </div>
        </motion.div>

        {/* Map Section */}
        {isLoaded ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="overflow-hidden rounded-2xl shadow-lg mb-10 border border-gray-200"
          >
            {deliveryLocation ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={{ lat: deliveryLocation.lat, lng: deliveryLocation.lng }}
                zoom={15}
              >
                <Marker
                  position={{ lat: deliveryLocation.lat, lng: deliveryLocation.lng }}
                  title="Delivery Partner Location"
                />
              </GoogleMap>
            ) : (
              <p className="text-center text-gray-500 py-10 text-lg">Waiting for delivery location...</p>
            )}
          </motion.div>
        ) : (
          <p className="text-center text-gray-500">Loading map...</p>
        )}

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-8 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🧾 Order Summary</h2>
          <div className="divide-y divide-gray-200">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between py-3 text-gray-700">
                <span>{item.name} × {item.quantity}</span>
                <span className="font-semibold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between text-xl font-bold text-gray-800">
            <span>Total</span>
            <span>₹{order.totalPrice}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderTracking;

  


