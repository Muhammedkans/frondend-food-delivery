// src/pages/Restaurant/Dashboard.jsx
import React, { useEffect, useState } from "react";
import RestaurantLayout from "../../layout/RestaurantLayout";
import restaurantApi from "../../api/restaurantApi";
import { FaUtensils, FaBoxOpen, FaClock } from "react-icons/fa";

const Dashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await restaurantApi.getProfile();
        setRestaurant(res.data.restaurant);
      } catch (error) {
        console.error("Error fetching restaurant profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return (
      <p className="text-neonGreen text-xl p-6">
        Loading restaurant dashboard...
      </p>
    );

  if (!restaurant)
    return (
      <p className="text-red-500 text-xl p-6">
        Restaurant profile not found!
      </p>
    );

  return (
    <RestaurantLayout>
      <div className="p-6 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold text-neonGreen mb-6">
          Welcome, {restaurant.name}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Dishes */}
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transform transition">
            <div className="flex items-center gap-3 mb-3">
              <FaUtensils className="text-neonBlue text-2xl" />
              <h2 className="text-lg font-semibold text-neonBlue">Total Dishes</h2>
            </div>
            <p className="text-gray-300 text-xl">
              {restaurant.menu?.length || 0}
            </p>
          </div>

          {/* Total Orders */}
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transform transition">
            <div className="flex items-center gap-3 mb-3">
              <FaBoxOpen className="text-neonBlue text-2xl" />
              <h2 className="text-lg font-semibold text-neonBlue">Total Orders</h2>
            </div>
            <p className="text-gray-300 text-xl">
              {restaurant.orders?.length || 0}
            </p>
          </div>

          {/* Average Delivery Time */}
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transform transition">
            <div className="flex items-center gap-3 mb-3">
              <FaClock className="text-neonBlue text-2xl" />
              <h2 className="text-lg font-semibold text-neonBlue">
                Avg. Delivery Time
              </h2>
            </div>
            <p className="text-gray-300 text-xl">
              {restaurant.deliveryTime || "N/A"} mins
            </p>
          </div>
        </div>

        <div className="p-6 bg-gray-800 rounded-2xl shadow-lg text-gray-300">
          <h2 className="text-2xl font-bold text-neonGreen mb-4">Restaurant Info</h2>
          <p>
            <span className="font-semibold text-neonBlue">Address:</span>{" "}
            {restaurant.address}
          </p>
          <p>
            <span className="font-semibold text-neonBlue">Phone:</span>{" "}
            {restaurant.phone}
          </p>
          <p>
            <span className="font-semibold text-neonBlue">Cuisines:</span>{" "}
            {restaurant.cuisines?.join(", ")}
          </p>
          <p>
            <span className="font-semibold text-neonBlue">Status:</span>{" "}
            {restaurant.restaurantDetails?.isOpen ? (
              <span className="text-neonGreen">Open</span>
            ) : (
              <span className="text-red-500">Closed</span>
            )}
          </p>
        </div>
      </div>
    </RestaurantLayout>
  );
};

export default Dashboard;
