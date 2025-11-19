// src/pages/Customer/RestaurantMenu.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import restaurantApi from "../../api/restaurantApi";
import cartApi from "../../api/customerApi";
import customerApi from "../../api/customerApi";

const RestaurantMenu = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedDish, setSelectedDish] = useState(null);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await restaurantApi.getRestaurantById(restaurantId);
        if (response.data.success) {
          setRestaurant(response.data.restaurant);
          setDishes(response.data.menu || []);
        } else {
          toast.error("Failed to load restaurant details.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Unable to fetch restaurant details.");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantDetails();
  }, [restaurantId]);

  const addToCart = async (dishId) => {
    try {
      const response = await customerApi.addToCart({ dishId, quantity: 1 });
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

  const categories = useMemo(() => {
    const uniqueCategories = ["All"];
    dishes.forEach((dish) => {
      if (dish.category && !uniqueCategories.includes(dish.category)) {
        uniqueCategories.push(dish.category);
      }
    });
    return uniqueCategories;
  }, [dishes]);

  const filteredDishes = useMemo(() => {
    if (activeCategory === "All") return dishes;
    return dishes.filter((dish) => dish.category === activeCategory);
  }, [dishes, activeCategory]);

  if (loading) {
    return <p className="text-neonGreen text-center text-xl mt-20">Loading...</p>;
  }

  if (!restaurant) {
    return <p className="text-red-400 text-center text-xl mt-20">Restaurant Not Found.</p>;
  }

  return (
    <div className="min-h-screen bg-[#030711] text-white">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        <Hero restaurant={restaurant} />
        <Highlights />
        <div className="grid lg:grid-cols-[2fr_1fr] gap-10">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
            <CategoryFilter categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
            <MenuList dishes={filteredDishes} onSelectDish={setSelectedDish} addToCart={addToCart} />
          </div>
          <div className="space-y-6">
            <LivePrepPanel restaurant={restaurant} />
            <ChefStory restaurant={restaurant} />
            <UpsellCard />
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

const Hero = ({ restaurant }) => (
  <section className="relative rounded-3xl border border-white/10 bg-linear-to-r from-[#111827] via-[#0b1221] to-[#0b1324] p-8 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.15),transparent_55%)]" />
    <div className="relative z-10 flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-4">
        <p className="uppercase text-sm tracking-[0.4em] text-gray-400">
          Chef spotlight
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-white">
          {restaurant.name}
        </h1>
        <p className="text-gray-300 text-lg">
          {restaurant.description || "Haute cuisine meets cloud-kitchen energy."}
        </p>
        <div className="flex gap-6 text-sm text-gray-400">
          <span>{restaurant.cuisineType || "Fusion lab"}</span>
          <span>📍 {restaurant.location || "City Center"}</span>
          <span>₹₹ · {restaurant.priceCategory || "Premium"}</span>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-4">
        <HeroStat
          label="Chef rating"
          value={`⭐ ${restaurant.averageRating || 4.8}`}
          hint="Verified diners"
        />
        <HeroStat
          label="Prep time"
          value={`${restaurant.estimatedDeliveryTime || "25"} mins`}
          hint="Real-time load"
        />
        <HeroStat label="Streak" value="12 nights" hint="Zero cancellations" />
        <HeroStat label="Loyalty boost" value="+2X" hint="Neon rewards" />
      </div>
    </div>
  </section>
);

const HeroStat = ({ label, value, hint }) => (
  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
    <p className="text-xs uppercase tracking-[0.4em] text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-white mt-2">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{hint}</p>
  </div>
);

const Highlights = () => (
  <section className="grid md:grid-cols-3 gap-4">
    {[
      { title: "Chef’s tasting counters", detail: "Limited-release menus updated hourly" },
      { title: "Zero-delay rider relay", detail: "Hand-off coordination tracked live" },
      { title: "Priority packaging", detail: "Climate-controlled pods for precision" },
    ].map((highlight) => (
      <div key={highlight.title} className="rounded-2xl border border-white/5 bg-white/5 p-4">
        <p className="text-sm uppercase tracking-[0.4em] text-gray-500">{highlight.title}</p>
        <p className="text-gray-300 text-sm mt-2">{highlight.detail}</p>
      </div>
    ))}
  </section>
);

const CategoryFilter = ({ categories, activeCategory, setActiveCategory }) => (
  <div className="flex flex-wrap gap-3">
    {categories.map((category) => (
      <button
        key={category}
        onClick={() => setActiveCategory(category)}
        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
          activeCategory === category ? "bg-emerald-400 text-black border-emerald-300" : "bg-white/5 text-gray-300 border-white/10"
        }`}
      >
        {category}
      </button>
    ))}
  </div>
);

const MenuList = ({ dishes, onSelectDish, addToCart }) => {
  if (!dishes.length) {
    return <p className="text-gray-500 text-sm text-center py-10">No dishes in this lane yet.</p>;
  }

  return (
    <div className="space-y-4">
      {dishes.map((dish) => (
        <motion.article
          key={dish._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-white/30 transition"
        >
          <img src={dish.image || "/logo.png"} alt={dish.name} className="w-28 h-28 rounded-xl object-cover" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{dish.name}</h3>
              <span className="text-emerald-300 font-bold text-lg">₹{dish.price}</span>
            </div>
            <p className="text-sm text-gray-400 line-clamp-2">{dish.description}</p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-400">
              {dish.isSpicy && <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-300">Spicy</span>}
              {dish.isVeg ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300">Pure veg</span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300">Non veg</span>
              )}
            </div>
            <div className="flex justify-between items-center pt-2">
              <button onClick={() => onSelectDish(dish)} className="text-sm text-gray-300 hover:text-white">
                View details →
              </button>
              <button onClick={() => addToCart(dish._id)} className="px-4 py-2 rounded-xl bg-emerald-400 text-black font-semibold shadow hover:bg-emerald-300 transition">
                Add
              </button>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
};


