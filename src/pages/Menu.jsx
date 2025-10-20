import React, { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { toast } from "react-hot-toast";
import { Search } from "lucide-react";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchMenu();
    fetchCategories();
    fetchRecommended();
  }, [selectedCategory, sort]);

  // ✅ Fetch menu items
  const fetchMenu = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/menu", {
        params: { category: selectedCategory, search, sort },
      });
      setMenuItems(data);
    } catch (err) {
      console.error("Error fetching menu:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/menu/categories");
      setCategories(["All", ...data]);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // ✅ Fetch recommended dishes
  const fetchRecommended = async () => {
    try {
      const { data } = await API.get("/menu/recommended");
      setRecommended(data);
    } catch (err) {
      console.error("Error fetching recommended:", err);
    }
  };

  // ✅ Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    fetchMenu();
  };

  // ✅ Add to cart
  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    toast.success(`${item.name} added to cart 🛒`, { duration: 1500 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-10">
        {/* 🏷️ Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
            Explore Delicious Menu 🍱
          </h1>
          <p className="text-gray-600 mt-2">
            Discover trending dishes & chef’s specials — tailored for your taste.
          </p>
        </div>

        {/* 🔍 Search + Sort */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-3 mb-8 justify-center"
        >
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute top-3 left-3 text-gray-400" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for your favorite dish..."
              className="w-full pl-10 pr-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border px-3 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">Sort</option>
            <option value="price_low_high">💸 Price: Low → High</option>
            <option value="price_high_low">💰 Price: High → Low</option>
          </select>

          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:opacity-90 shadow-md transition"
          >
            Search
          </button>
        </form>

        {/* 🍔 Categories */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-8 justify-center no-scrollbar">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full border shadow-sm font-medium transition ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* 🌟 Recommended Dishes */}
        {recommended.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-gray-800">
                Chef’s Picks 🍽️
              </h2>
              <span className="text-sm text-gray-500">AI Recommended</span>
            </div>

            <div className="flex gap-5 overflow-x-auto pb-2 no-scrollbar">
              {recommended.map((item) => (
                <motion.div
                  key={item._id}
                  whileHover={{ scale: 1.05 }}
                  className="min-w-[240px] bg-white rounded-2xl shadow-lg hover:shadow-xl transition transform"
                >
                  <img
                    src={item.image || "/food-placeholder.jpg"}
                    alt={item.name}
                    className="h-40 w-full object-cover rounded-t-2xl"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{item.category}</p>
                    <p className="text-indigo-600 font-bold mt-1">
                      ₹{item.price}
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAddToCart(item)}
                      className="mt-3 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg hover:opacity-90 transition"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* 🍕 All Menu Items */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 rounded-2xl shadow-sm"
              ></div>
            ))}
          </div>
        ) : menuItems.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No dishes found. Try searching something else 🍜
          </p>
        ) : (
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {menuItems.map((item) => (
              <motion.div
                key={item._id}
                whileHover={{ scale: 1.04 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden"
              >
                <img
                  src={item.image || "/food-placeholder.jpg"}
                  alt={item.name}
                  className="h-44 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{item.category}</p>
                  <p className="text-indigo-600 font-bold mt-1">
                    ₹{item.price}
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAddToCart(item)}
                    className="mt-3 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg hover:opacity-90 transition"
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Menu;



