// src/pages/Customer/RestaurantMenu.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import restaurantApi from "../../api/restaurantApi";
import cartApi from "../../api/customerApi";

const RestaurantMenu = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedDish, setSelectedDish] = useState(null);

  // ------------------------------------------------------
  // Fetch Restaurant + Menu
  // ------------------------------------------------------
  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const restaurantRes = await restaurantApi.getSingleRestaurant(restaurantId);
        const menuRes = await restaurantApi.getRestaurantMenu(restaurantId);

        if (restaurantRes.data.success) {
          setRestaurant(restaurantRes.data.restaurant);
        }

        if (menuRes.data.success) {
          setDishes(menuRes.data.dishes || []);
        }
      } catch (error) {
        console.error(error);
        toast.error("Unable to load restaurant details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  // ------------------------------------------------------
  // Add to Cart
  // ------------------------------------------------------
  const addToCart = async (dishId) => {
    try {
      const response = await cartApi.addToCart({ dishId, quantity: 1 });

      if (response.data.success) {
        toast.success("Added to cart!");
      } else {
        toast.error("Failed to add to cart.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Couldn't add item to cart.");
    }
  };

  // ------------------------------------------------------
  // Category List
  // ------------------------------------------------------
  const categories = useMemo(() => {
    const unique = ["All"];
    dishes.forEach((dish) => {
      if (dish.category && !unique.includes(dish.category)) {
        unique.push(dish.category);
      }
    });
    return unique;
  }, [dishes]);

  // ------------------------------------------------------
  // Filter Menu
  // ------------------------------------------------------
  const filteredDishes = useMemo(() => {
    if (activeCategory === "All") return dishes;
    return dishes.filter((dish) => dish.category === activeCategory);
  }, [dishes, activeCategory]);

  // ------------------------------------------------------
  // Loading / Not found
  // ------------------------------------------------------
  if (loading) {
    return <p className="text-neonGreen text-center text-xl mt-20">Loading...</p>;
  }

  if (!restaurant) {
    return <p className="text-red-400 text-center text-xl mt-20">Restaurant Not Found.</p>;
  }

  // ------------------------------------------------------
  // Main UI
  // ------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#030711] text-white">
      {/* Hero / Banner */}
      <Hero restaurant={restaurant} />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        <Highlights />

        <div className="grid lg:grid-cols-[2fr_1fr] gap-10">
          {/* MENU */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6 backdrop-blur-md">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
            <MenuList
              dishes={filteredDishes}
              onSelectDish={setSelectedDish}
              addToCart={addToCart}
            />
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-lg">
              <h2 className="text-lg font-semibold text-white">Restaurant Info</h2>
              <p className="text-gray-400 mt-2 text-sm">
                {restaurant.description ||
                  "Premium dishes crafted with high-quality ingredients."}
              </p>
              <p className="text-gray-400 mt-2 text-sm">
                Cuisine: {restaurant.cuisineType}
              </p>
              <p className="text-gray-400 mt-2 text-sm">
                Avg. Rating: {restaurant.averageRating} ⭐ ({restaurant.totalReviews} reviews)
              </p>
              <p className="text-gray-400 mt-2 text-sm">
                Delivery Time: {restaurant.estimatedDeliveryTime} mins
              </p>
            </div>
          </div>
        </div>

        {selectedDish && (
          <DishModal
            dish={selectedDish}
            onClose={() => setSelectedDish(null)}
            addToCart={() => {
              addToCart(selectedDish._id);
              setSelectedDish(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default RestaurantMenu;

/* -------------------------------------------------------
   SUB COMPONENTS
------------------------------------------------------- */

const Hero = ({ restaurant }) => (
  <section
    className="relative rounded-3xl border border-white/10 overflow-hidden h-[350px] md:h-[400px] lg:h-[450px]"
    style={{
      backgroundImage: `url(${restaurant.bannerImage || restaurant.image || "/logo.png"})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
    <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-16 z-10">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg">
        {restaurant.name}
      </h1>
      <p className="text-gray-300 text-lg md:text-xl mt-2 drop-shadow-md">
        {restaurant.description || "Haute cuisine meets cloud-kitchen energy."}
      </p>
      <div className="flex gap-6 mt-4 text-sm md:text-base text-gray-300">
        <span className="flex items-center gap-1">
          ⭐ {restaurant.averageRating} ({restaurant.totalReviews})
        </span>
        <span>{restaurant.cuisineType}</span>
        <span>Delivery: {restaurant.estimatedDeliveryTime} mins</span>
      </div>
    </div>
  </section>
);

const Highlights = () => (
  <section className="grid md:grid-cols-3 gap-4">
    {[
      { title: "Chef’s tasting counters", detail: "Limited-release menus updated hourly" },
      { title: "Zero-delay rider relay", detail: "Hand-off coordination tracked live" },
      { title: "Priority packaging", detail: "Climate-controlled pods for precision" },
    ].map((h) => (
      <div
        key={h.title}
        className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-md shadow-lg hover:scale-105 transition-transform"
      >
        <p className="text-sm uppercase tracking-[0.4em] text-gray-500">{h.title}</p>
        <p className="text-gray-300 text-sm mt-2">{h.detail}</p>
      </div>
    ))}
  </section>
);

const CategoryFilter = ({ categories, activeCategory, setActiveCategory }) => (
  <div className="flex flex-wrap gap-3">
    {categories.map((category) => (
      <motion.button
        key={category}
        onClick={() => setActiveCategory(category)}
        whileTap={{ scale: 0.95 }}
        className={`px-5 py-2 rounded-3xl text-sm font-semibold border transition ${
          activeCategory === category
            ? "bg-emerald-400 text-black border-emerald-300 shadow-lg"
            : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
        }`}
      >
        {category}
      </motion.button>
    ))}
  </div>
);

const MenuList = ({ dishes, onSelectDish, addToCart }) => {
  if (!dishes.length) {
    return (
      <p className="text-gray-500 text-sm text-center py-10">No dishes available.</p>
    );
  }

  return (
    <div className="space-y-4">
      {dishes.map((dish) => (
        <motion.article
          key={dish._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-white/30 hover:shadow-lg hover:scale-[1.02] transition-transform backdrop-blur-md"
        >
          <img
            src={dish.imageUrl || "/logo.png"}
            alt={dish.name}
            className="w-28 h-28 rounded-xl object-cover"
          />

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{dish.name}</h3>
              <span className="text-emerald-300 font-bold text-lg">₹{dish.price}</span>
            </div>

            <p className="text-sm text-gray-400 line-clamp-2">{dish.description}</p>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => onSelectDish(dish)}
                className="text-sm text-gray-300 hover:text-white transition"
              >
                View details →
              </button>

              <button
                onClick={() => addToCart(dish._id)}
                className="px-4 py-2 rounded-xl bg-emerald-400 text-black font-semibold shadow hover:bg-emerald-300 transition"
              >
                Add
              </button>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
};



/* -------------------------------------------------------
   END OF FILE
------------------------------------------------------- */



