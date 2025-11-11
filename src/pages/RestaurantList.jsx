import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Toast from "../components/Toast";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("/restaurant/all");
        setRestaurants(res.data);
      } catch (error) {
        setToast({ type: "error", message: "Failed to load restaurants" });
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {toast && <Toast type={toast.type} message={toast.message} />}
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        🍽️ Restaurants
      </h2>
      {restaurants.length === 0 ? (
        <p className="text-gray-500">No restaurants available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {restaurants.map((rest) => (
            <div
              key={rest._id}
              onClick={() => navigate(`/restaurant/${rest._id}`)}
              className="cursor-pointer bg-white dark:bg-gray-800 p-4 rounded-2xl shadow hover:shadow-lg transition-all"
            >
              <img
                src={rest.image || "https://via.placeholder.com/300"}
                alt={rest.name}
                className="w-full h-40 object-cover rounded-xl"
              />
              <h3 className="text-lg font-semibold mt-3 text-gray-900 dark:text-gray-100">
                {rest.name}
              </h3>
              <p className="text-sm text-gray-500">{rest.description}</p>
              <p className="text-xs text-gray-400 mt-1">{rest.address}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;

