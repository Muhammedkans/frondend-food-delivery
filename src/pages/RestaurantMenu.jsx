import { useParams } from "react-router-dom";
import {
  useGetMenuQuery,
  useAddToCartMutation,
} from "../redux/api/customerApi";
import { motion } from "framer-motion";

const RestaurantMenu = () => {
  const { restaurantId } = useParams();

  const { data, isLoading, isError } = useGetMenuQuery(restaurantId);
  const [addToCart] = useAddToCartMutation();

  if (isLoading)
    return (
      <div className="text-center text-xl text-[#00ff9d]">
        Loading menu...
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-red-400 text-xl">
        Failed to load menu
      </div>
    );

  const { restaurant, dishes } = data;

  const handleAdd = async (dish) => {
    try {
      await addToCart({
        dishId: dish._id,
        quantity: 1,
      }).unwrap();

      alert("✅ Item added to cart");
    } catch (error) {
      alert("❌ Failed to add item");
    }
  };

  return (
    <div>
      {/* ✅ Restaurant Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold neon-green">
          {restaurant.restaurantDetails.restaurantName}
        </h1>

        <p className="text-gray-400 mt-1">{restaurant.address}</p>

        <p className="mt-2 text-gray-300">
          {restaurant.restaurantDetails.isApproved ? "✅ Verified" : "⏳ Pending"}
        </p>
      </div>

      {/* ✅ Dishes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {dishes.map((dish) => (
          <motion.div
            key={dish._id}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(0,255,157,0.15)]"
          >
            {/* ✅ Dish Image */}
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-40 object-cover rounded-xl"
            />

            <div className="mt-4">
              <h2 className="text-xl font-semibold">{dish.name}</h2>

              <p className="text-gray-400 mt-1">{dish.description}</p>

              <p className="text-[#00ff9d] font-bold mt-2">₹ {dish.price}</p>

              {/* ✅ ADD TO CART BUTTON */}
              <button
                onClick={() => handleAdd(dish)}
                className="mt-4 w-full px-4 py-2 bg-[#00ff9d] text-black font-semibold rounded-xl hover:bg-[#00ffbb] transition shadow-[0_0_10px_#00ff9d]"
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantMenu;
