// src/pages/Customer/Home.jsx
import React, { useEffect, useState } from "react";
import restaurantApi from "../../api/restaurantApi";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await restaurantApi.getAllRestaurants();
      if (response.data.success) {
        setRestaurants(response.data.restaurants);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] bg-linear-to-r from-green-600 via-green-900 to-black flex flex-col justify-center items-center text-center overflow-hidden">
        <h1 className="text-6xl font-extrabold neon-text mb-4 animate-pulse">
          Neon Eats
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          Discover your favorite food, delivered instantly
        </p>
        <div className="flex space-x-4">
          <Link
            to="/login/customer"
            className="px-6 py-3 bg-neonGreen text-black font-bold rounded-2xl hover:bg-neonGreen/80 transition-all"
          >
            Customer Login
          </Link>
          <Link
            to="/login/restaurant"
            className="px-6 py-3 bg-neonGreen text-black font-bold rounded-2xl hover:bg-neonGreen/80 transition-all"
          >
            Restaurant Login
          </Link>
        </div>
        <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-black to-transparent"></div>
      </div>

      {/* Restaurants Grid Section */}
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-4xl font-bold neon-text mb-8 text-center">
          Featured Restaurants
        </h2>

        {loading ? (
          <div className="text-center text-green-400 text-xl">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant._id}
                to={`/customer/restaurant/${restaurant._id}`}
                className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 hover:shadow-neon transition-transform duration-300 border border-gray-700 relative"
              >
                {/* Neon Glow Banner */}
                <div className="relative">
                  <img
                    src={restaurant.banner || "/logo.png"}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover brightness-90"
                  />
                  <span
                    className={`absolute top-3 left-3 px-2 py-1 rounded-md text-sm font-bold ${
                      restaurant.isOpen
                        ? "bg-green-500 text-black"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {restaurant.isOpen ? "Open Now" : "Closed"}
                  </span>
                </div>

                {/* Restaurant Info */}
                <div className="p-4">
                  <h3 className="text-xl font-extrabold neon-text mb-1">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {restaurant.cuisine || "Various Cuisines"}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-green-400 font-semibold">
                      {restaurant.rating ? `⭐ ${restaurant.rating}` : "⭐ 4.5"}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {restaurant.deliveryTime || "30-45 min"}
                    </p>
                  </div>
                </div>

                {/* Neon Border Glow */}
                <div className="absolute inset-0 border-2 border-neonGreen rounded-2xl pointer-events-none animate-pulse"></div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;


