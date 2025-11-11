import React from "react";
import { Link } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant._id}`} className="transform hover:scale-105 transition-transform duration-300">
      <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl">
        <img
          src={restaurant.banner || "/logo.png"}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-bold text-green-400">{restaurant.name}</h3>
          <p className="text-gray-400 text-sm mt-1">{restaurant.cuisine}</p>
          <p className="text-gray-500 text-xs mt-1">{restaurant.location}</p>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
