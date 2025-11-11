// src/pages/Admin/ManageRestaurants.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import adminApi from "../../api/adminApi";
import { FaUtensils, FaToggleOn, FaToggleOff } from "react-icons/fa";

const ManageRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await adminApi.getAllRestaurants();
        setRestaurants(res.data.restaurants);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const toggleStatus = async (id) => {
    try {
      await adminApi.toggleRestaurantStatus(id);
      setRestaurants((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, restaurantDetails: { ...r.restaurantDetails, isOpen: !r.restaurantDetails.isOpen } } : r
        )
      );
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  if (loading) return <p className="text-neonGreen text-xl p-6">Loading restaurants...</p>;

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold text-neonGreen mb-6">Manage Restaurants</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="p-4 bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transform transition"
            >
              <img
                src={restaurant.restaurantDetails?.logo || "/logo.png"}
                alt={restaurant.name}
                className="w-20 h-20 rounded-full mb-4 mx-auto object-cover border-2 border-neonGreen"
              />
              <h2 className="text-xl font-bold text-neonBlue text-center">{restaurant.name}</h2>
              <p className="text-gray-300 text-center mt-1">{restaurant.cuisines?.join(", ")}</p>

              <div className="flex justify-center items-center mt-4 space-x-4">
                <button
                  onClick={() => toggleStatus(restaurant._id)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full font-semibold ${
                    restaurant.restaurantDetails?.isOpen
                      ? "bg-neonGreen text-gray-900"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {restaurant.restaurantDetails?.isOpen ? <FaToggleOn /> : <FaToggleOff />}
                  {restaurant.restaurantDetails?.isOpen ? "Open" : "Closed"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageRestaurants;
