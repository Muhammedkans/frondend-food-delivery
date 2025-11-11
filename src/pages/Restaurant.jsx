// src/pages/Restaurant.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // ✅ get restaurant ID from URL
import { useSelector } from "react-redux";
import axios from "../api/api"; // ✅ use your existing axios instance
import AISuggestions from "../components/AISuggestions";
import MenuItemCard from "../components/MenuItemCard";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const Restaurant = () => {
  const { id } = useParams(); // ✅ /restaurant/:id
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const { cartItems } = useSelector((state) => state.cart);

  // ✅ Fetch single restaurant details
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const { data } = await axios.get(`/restaurant/${id}`);
        setRestaurant(data.restaurant || data);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading restaurant details...
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Restaurant not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 md:px-8">
      {/* Restaurant Header */}
      <motion.div
        className="max-w-6xl mx-auto bg-white rounded-3xl shadow-md p-6 md:p-10 mb-10 flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Restaurant Image */}
        {restaurant.image ? (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-40 h-40 md:w-56 md:h-56 object-cover rounded-2xl shadow-lg"
          />
        ) : (
          <div className="w-40 h-40 md:w-56 md:h-56 bg-gray-200 rounded-2xl animate-pulse" />
        )}

        {/* Restaurant Info */}
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            {restaurant.name}
          </h1>
          {restaurant.location && (
            <p className="text-gray-600 mb-2 text-lg">{restaurant.location}</p>
          )}
          {restaurant.cuisine && (
            <p className="text-gray-500 text-sm mb-4">
              Cuisine: {restaurant.cuisine}
            </p>
          )}

          {/* Ratings & Meta Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
              <Star className="w-4 h-4 mr-1 text-yellow-500" />{" "}
              {restaurant.rating ? restaurant.rating.toFixed(1) : "4.2"}
            </div>
            <span className="text-gray-400 text-sm">•</span>
            <span className="text-gray-500 text-sm">
              {restaurant.deliveryTime || 25} mins delivery
            </span>
            <span className="text-gray-400 text-sm">•</span>
            <span className="text-gray-500 text-sm">
              ₹{restaurant.avgPrice || 200} for two
            </span>
          </div>
        </div>
      </motion.div>

      {/* 🧠 AI Recommendations */}
      <motion.section
        className="max-w-6xl mx-auto mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center">
          <span className="mr-2">🧠</span> AI-Powered Recommendations
        </h2>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <AISuggestions restaurantId={restaurant._id} />
        </div>
      </motion.section>

      {/* 🍽️ Menu Section */}
      <motion.section
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">Menu</h2>
          <div className="text-gray-500 text-sm">
            {restaurant.menu?.length || 0} items
          </div>
        </div>

        {restaurant.menu && restaurant.menu.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {restaurant.menu.map((item) => (
              <motion.div
                key={item._id}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <MenuItemCard menuItem={item} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10 text-lg italic">
            No menu items available for this restaurant yet.
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default Restaurant;





