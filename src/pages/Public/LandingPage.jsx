// src/pages/LandingPage.jsx
import React, { useEffect, useState } from "react";
import restaurantApi from "../../api/restaurantApi";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const LandingPage = () => {
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
      <div className="relative w-full h-[500px] bg-linear-to-r from-green-600 via-green-900 to-black flex flex-col justify-center items-center text-center overflow-hidden">
        <h1 className="text-7xl font-extrabold neon-text mb-4 animate-pulse">
          Neon Eats
        </h1>
        <p className="text-2xl text-gray-300 mb-8">
          Discover your favorite food, delivered instantly
        </p>
        <div className="flex space-x-6">
          <Link
            to="/login/customer"
            className="px-8 py-4 bg-neonGreen text-black font-bold rounded-3xl hover:bg-neonGreen/80 transition-all shadow-neon"
          >
            Customer Login
          </Link>
          <Link
            to="/login/restaurant"
            className="px-8 py-4 bg-neonGreen text-black font-bold rounded-3xl hover:bg-neonGreen/80 transition-all shadow-neon"
          >
            Restaurant Login
          </Link>
          <Link
            to="/login/delivery"
            className="px-8 py-4 bg-neonGreen text-black font-bold rounded-3xl hover:bg-neonGreen/80 transition-all shadow-neon"
          >
            Delivery Login
          </Link>
        </div>
        <div className="absolute bottom-0 w-full h-40 bg-linear-to-t from-black to-transparent"></div>
      </div>

      {/* Featured Restaurants Section */}
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-5xl font-bold neon-text mb-10 text-center">
          Featured Restaurants
        </h2>
        {loading ? (
          <div className="text-center text-green-400 text-xl">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {restaurants.length === 0 ? (
              <p className="text-center text-gray-400 col-span-full">
                No restaurants found. Please add some from the admin panel.
              </p>
            ) : (
              restaurants.map((restaurant) => (
                <Link
                  key={restaurant._id}
                  to={`/restaurant/${restaurant._id}`}
                  className="bg-gray-900 rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 hover:shadow-neon transition-transform duration-300 border border-gray-700 relative"
                >
                  <div className="relative">
                    <img
                      src={
                        restaurant.bannerImage ||
                        restaurant.image ||
                        "/logo.png"
                      }
                      alt={restaurant.name}
                      className="w-full h-52 object-cover brightness-90"
                    />
                    <span
                      className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-sm font-bold ${
                        restaurant.isOpen
                          ? "bg-green-500 text-black"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {restaurant.isOpen ? "Open Now" : "Closed"}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-2xl font-extrabold neon-text mb-2">
                      {restaurant.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {restaurant.cuisineType || "Various Cuisines"}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-green-400 font-semibold">
                        ⭐ {restaurant.averageRating || 4.5}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {restaurant.estimatedDeliveryTime || "30"} mins
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 border-2 border-neonGreen rounded-3xl pointer-events-none animate-pulse"></div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;

