import { useGetHomepageRestaurantsQuery } from "../redux/api/customerApi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
  const { data, isLoading, isError } = useGetHomepageRestaurantsQuery();

  if (isLoading)
    return (
      <div className="text-center text-xl text-[#00ff9d]">
        Loading restaurants...
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-red-400 text-xl">
        Failed to load restaurants
      </div>
    );

  const restaurants = data?.restaurants || [];

  return (
    <div>
      {/* ✅ Page Title */}
      <h1 className="text-3xl font-bold mb-6 neon-green">
        Featured Restaurants
      </h1>

      {/* ✅ Restaurants Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {restaurants.map((rest) => (
          <motion.div
            key={rest._id}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(0,255,157,0.1)]"
          >
            {/* ✅ Restaurant Image */}
            <img
              src={rest.profileImage}
              alt={rest.restaurantDetails?.restaurantName}
              className="w-full h-40 object-cover rounded-xl"
            />

            <div className="mt-4">
              <h2 className="text-xl font-semibold">
                {rest.restaurantDetails?.restaurantName}
              </h2>

              <p className="text-gray-400">
                {rest.address || "No address available"}
              </p>

              <p className="text-gray-300 mt-2">
                ⭐ {rest.restaurantDetails?.isApproved ? "Verified" : "Pending"}
              </p>

              {/* ✅ View Menu Button */}
              <Link
                to={`/restaurant/${rest._id}`}
                className="block text-center mt-4 px-4 py-2 bg-[#00ff9d] text-black font-semibold rounded-xl hover:bg-[#00ffbb] transition shadow-[0_0_10px_#00ff9d]"
              >
                View Menu
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;











