// src/pages/RestaurantDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import { formatCurrency } from "../utils/formatCurrency";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";

const RestaurantDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resRestaurant = await api.get(`/restaurant/single/${id}`);
        const resMenu = await api.get(`/restaurant/menu/${id}`);

        setRestaurant(resRestaurant.data.restaurant);
        setDishes(resMenu.data.dishes || []);
      } catch (err) {
        setToast({ type: "error", message: "Failed to load restaurant" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = async (dishId) => {
    dispatch(addToCart({ dishId, quantity: 1 }));
    setToast({ type: "success", message: "Added to cart!" });
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {toast && <Toast type={toast.type} message={toast.message} />}

      {/* Restaurant */}
      {restaurant && (
        <div className="mb-6">
          <img
            src={restaurant.image}
            className="w-full h-60 object-cover rounded-xl shadow"
          />
          <h2 className="text-3xl mt-4 font-bold">{restaurant.name}</h2>
          <p className="text-gray-600 mt-2">{restaurant.description}</p>
        </div>
      )}

      {/* Menu */}
      <h3 className="text-2xl font-semibold mb-4">Menu</h3>

      {dishes.length === 0 ? (
        <p className="text-gray-500">No dishes available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dishes.map((dish) => (
            <div
              key={dish._id}
              className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow"
            >
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-40 object-cover rounded-xl"
              />
              <h3 className="text-lg font-semibold mt-3">{dish.name}</h3>
              <p className="text-sm text-gray-500">{dish.description}</p>
              <p className="text-sm font-medium mt-1">
                {formatCurrency(dish.price)}
              </p>

              <button
                onClick={() => handleAddToCart(dish._id)}
                className="mt-3 w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;


