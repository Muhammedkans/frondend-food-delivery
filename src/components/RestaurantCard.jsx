// src/components/RestaurantCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, MapPin } from "lucide-react";

const RestaurantCard = ({ restaurant }) => {
  const image =
    restaurant.image ||
    `https://source.unsplash.com/800x600/?restaurant,food,${encodeURIComponent(
      restaurant.name || ""
    )}`;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="cursor-pointer"
    >
      <Link
        to={`/restaurant/${restaurant._id}`}
        className="block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
      >
        {/* Image Section */}
        <div className="relative h-52">
          <img
            src={image}
            alt={restaurant.name}
            className="w-full h-full object-cover rounded-t-3xl"
          />
          {/* Offer tag */}
          {restaurant.offers?.length > 0 && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              {restaurant.offers[0]}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {restaurant.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 truncate">
            {restaurant.cuisine || "Multi-cuisine"}
          </p>

          {/* Ratings & Delivery Time */}
          <div className="flex items-center justify-between mt-4 text-gray-600 text-sm">
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span>{restaurant.rating || "4.5"}</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{restaurant.deliveryTime || "30-40 min"}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 mt-3 text-gray-500 text-xs">
            <MapPin size={14} />
            <span>
              {restaurant.location?.address || "Popular in your area"}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RestaurantCard;




