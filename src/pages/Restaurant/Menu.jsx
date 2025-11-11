// src/pages/Restaurant/Menu.jsx
import React, { useEffect, useState } from "react";
import RestaurantLayout from "../../layout/RestaurantLayout";
import restaurantApi from "../../api/restaurantApi";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const Menu = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMenu = async () => {
    try {
      const res = await restaurantApi.getProfile(); // profile has menu
      setDishes(res.data.restaurant.menu || []);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dishId) => {
    if (window.confirm("Are you sure you want to delete this dish?")) {
      try {
        await restaurantApi.deleteDish(dishId);
        setDishes(dishes.filter((dish) => dish._id !== dishId));
      } catch (error) {
        console.error("Failed to delete dish:", error);
      }
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  if (loading)
    return (
      <p className="text-neonGreen text-xl p-6">Loading menu...</p>
    );

  return (
    <RestaurantLayout>
      <div className="p-6 bg-gray-900 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-neonGreen">Your Menu</h1>
          <button className="flex items-center gap-2 bg-neonBlue hover:bg-neonGreen text-gray-900 px-4 py-2 rounded-xl font-semibold transition">
            <FaPlus /> Add New Dish
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dishes.length === 0 && (
            <p className="text-gray-300 col-span-3 text-center">
              No dishes added yet.
            </p>
          )}

          {dishes.map((dish) => (
            <div
              key={dish._id}
              className="p-6 bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transform transition"
            >
              <img
                src={dish.imageUrl}
                alt={dish.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold text-neonBlue mb-2">
                {dish.name}
              </h2>
              <p className="text-gray-300 mb-2">{dish.description}</p>
              <p className="text-neonGreen font-bold mb-4">${dish.price}</p>
              <div className="flex justify-between">
                <button className="flex items-center gap-2 bg-neonBlue hover:bg-neonGreen text-gray-900 px-3 py-1 rounded-xl font-semibold transition">
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(dish._id)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-gray-100 px-3 py-1 rounded-xl font-semibold transition"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RestaurantLayout>
  );
};

export default Menu;
