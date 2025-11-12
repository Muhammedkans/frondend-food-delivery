// src/pages/Customer/RestaurantMenu.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import restaurantApi from "../../api/restaurantApi";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToCart } from "../../slices/cartSlice";

const RestaurantMenu = () => {
  const { restaurantId } = useParams();
  const [dishes, setDishes] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const response = await restaurantApi.getRestaurantMenu(restaurantId);
      if (response.data.success) {
        setDishes(response.data.dishes);
        if (response.data.dishes.length > 0) {
          setRestaurantName(response.data.dishes[0].restaurantName || "Restaurant");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [restaurantId]);

  const handleAddToCart = (dish) => {
    dispatch(addToCart({ ...dish, quantity: 1 }));
    toast.success(`${dish.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold neon-text mb-6 text-center">
        {restaurantName} Menu
      </h1>

      {loading ? (
        <div className="text-center text-green-400 text-xl">Loading...</div>
      ) : dishes.length === 0 ? (
        <div className="text-center text-gray-400 text-xl">No dishes available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dishes.map((dish) => (
            <div
              key={dish._id}
              className="bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-700 transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={dish.imageUrl || "/logo.png"}
                alt={dish.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold neon-text mb-1">{dish.name}</h2>
                <p className="text-gray-400 text-sm mb-2">{dish.description}</p>
                <p className="text-green-400 font-semibold mb-2">${dish.price}</p>
                <button
                  onClick={() => handleAddToCart(dish)}
                  className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;

