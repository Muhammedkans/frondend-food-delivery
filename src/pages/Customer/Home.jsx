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
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold neon-text mb-6 text-center">
        Explore Restaurants
      </h1>

      {loading ? (
        <div className="text-center text-green-400 text-xl">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant._id}
              to={`/customer/restaurant/${restaurant._id}`}
              className="bg-gray-900 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 border border-gray-700"
            >
              <img
                src={restaurant.banner || "/logo.png"}
                alt={restaurant.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold neon-text mb-1">{restaurant.name}</h2>
                <p className="text-gray-400 text-sm mb-2">{restaurant.cuisine || "Various Cuisines"}</p>
                <p className="text-green-400 font-semibold">{restaurant.isOpen ? "Open Now" : "Closed"}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

