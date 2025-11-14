import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import restaurantApi from "../../api/restaurantApi";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  // ✅ Fetch all restaurants
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
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-[500px] flex flex-col justify-center items-center text-center overflow-hidden bg-linear-to-r from-[#00ff9d1a] via-[#00c8ff1a] to-[#00ff9d1a]"
      >
        <h1 className="text-6xl sm:text-7xl font-extrabold neon-text animate-pulse mb-4">
          Neon Eats
        </h1>
        <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-xl px-4">
          Discover your favorite food, delivered instantly. Experience premium futuristic neon food delivery like never before!
        </p>

        {!user ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-wrap justify-center gap-4"
          >
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
          </motion.div>
        ) : (
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/customer/profile")}
              className="px-8 py-4 bg-neonGreen text-black font-bold rounded-3xl hover:bg-neonGreen/80 transition-all shadow-neon"
            >
              Go to Profile
            </motion.button>
          </div>
        )}

        <div className="absolute bottom-0 w-full h-40 bg-linear-to-t from-black to-transparent"></div>
      </motion.section>

      {/* Featured Restaurants Section */}
      <section className="max-w-7xl mx-auto p-6">
        <h2 className="text-4xl sm:text-5xl font-bold neon-text mb-10 text-center">
          Featured Restaurants
        </h2>

        {loading ? (
          <div className="text-center text-neonGreen text-xl animate-pulse">
            Loading Restaurants...
          </div>
        ) : restaurants.length === 0 ? (
          <p className="text-center text-gray-400">
            No restaurants found. Please check back later.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {restaurants.map((restaurant) => (
              <motion.div
                key={restaurant._id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gray-900 rounded-3xl shadow-xl overflow-hidden relative border border-gray-700 hover:shadow-neon transition-shadow duration-300"
              >
                <Link to={`/customer/restaurant/${restaurant._id}`}>
                  {/* Banner Image */}
                  <div className="relative">
                    <img
                      src={restaurant.bannerImage || restaurant.image || "/logo.png"}
                      alt={restaurant.name}
                      className="w-full h-52 object-cover brightness-90"
                    />
                    <span
                      className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-sm font-bold ${
                        restaurant.isOpen ? "bg-green-500 text-black" : "bg-red-500 text-white"
                      }`}
                    >
                      {restaurant.isOpen ? "Open Now" : "Closed"}
                    </span>
                  </div>

                  {/* Restaurant Info */}
                  <div className="p-5">
                    <h3 className="text-2xl font-extrabold neon-text mb-2">
                      {restaurant.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {restaurant.cuisineType || "Various Cuisines"}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-neonGreen font-semibold">
                        ⭐ {restaurant.averageRating || 4.5}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {restaurant.estimatedDeliveryTime || "30-45 mins"}
                      </p>
                    </div>
                  </div>

                  {/* Neon Border Glow */}
                  <div className="absolute inset-0 border-2 border-neonGreen rounded-3xl pointer-events-none animate-pulse"></div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;







