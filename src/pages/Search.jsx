// src/pages/Search.jsx
import React, { useEffect, useState } from "react";
import api from "../api/api";
import Card from "../components/Card";
import DishCard from "../components/DishCard";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // ✅ Fetch restaurants + dishes on load
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [resRestaurants, resDishes] = await Promise.all([
        api.get("/restaurant/all"),
        api.get("/restaurant/all-dishes"), // ✅ Add this route or replace with your dish route
      ]);

      setRestaurants(resRestaurants.data || []);
      setDishes(resDishes.data.dishes || []);
    } catch (err) {
      setToast({ type: "error", message: "Failed to load search data" });
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDishes = dishes.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {toast && <Toast type={toast.type} message={toast.message} />}
      {loading && <Loader />}

      {/* ---------------- Search Input ---------------- */}
      <h1 className="text-3xl font-bold mb-4">Search</h1>

      <div className="relative mb-8 max-w-xl">
        <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search for dishes or restaurants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
          focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 dark:text-gray-200"
        />
      </div>

      {/* ---------------- Restaurants ---------------- */}
      <h2 className="text-2xl font-semibold mb-3">Restaurants</h2>

      {filteredRestaurants.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 mb-6">No restaurants found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {filteredRestaurants.map((res) => (
            <Card key={res._id} restaurant={res} />
          ))}
        </div>
      )}

      {/* ---------------- Dishes ---------------- */}
      <h2 className="text-2xl font-semibold mb-3">Dishes</h2>

      {filteredDishes.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 mt-4">No dishes found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDishes.map((dish) => (
            <DishCard key={dish._id} dish={dish} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;

