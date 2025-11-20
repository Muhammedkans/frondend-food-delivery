import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import restaurantApi from "../../api/restaurantApi";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await restaurantApi.getAllRestaurants();
      if (response.data.success) {
        setRestaurants(response.data.restaurants);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to fetch restaurants"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (restaurant.cuisineType || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesFilter =
        selectedFilter === "all" ||
        (selectedFilter === "open" && restaurant.isOpen) ||
        (selectedFilter === "trending" &&
          (restaurant.averageRating || 0) >= 4.5) ||
        (selectedFilter === "new" &&
          restaurant.createdAt &&
          new Date(restaurant.createdAt) >
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

      return matchesSearch && matchesFilter;
    });
  }, [restaurants, searchTerm, selectedFilter]);

  return (
    <div className="min-h-screen bg-[#030711] text-white relative overflow-x-hidden">
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full rounded-3xl max-w-7xl mx-auto mt-8 px-6 py-12 overflow-hidden bg-linear-to-r from-[#0f172a] via-[#0b1120] to-[#111827] border border-white/5"
      >
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.25),transparent_50%)]" />
        <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center">
          <div className="flex-1">
            <p className="uppercase tracking-widest text-xs text-emerald-300/80 mb-4">
              Swiggy-grade experience, bespoke for you
            </p>
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-black text-white mb-6">
              Order from futuristic kitchens, delivered in lightning speed.
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              Neon Eats curates the city’s finest chefs, late-night cloud
              kitchens, and trending pop-ups. Unlock personalized picks, live
              tracking, AI food concierge, and loyalty boosters.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/customer/order-tracking")}
                className="px-6 py-3 rounded-2xl bg-emerald-400 text-black font-semibold shadow-neon hover:bg-emerald-300 transition"
              >
                Track your order
              </button>
              <button
                onClick={() => navigate("/customer/ai-assistant")}
                className="px-6 py-3 rounded-2xl border border-white/20 bg-white/5 text-white font-semibold hover:border-white/40 transition"
              >
                Ask the AI food oracle →
              </button>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <HeroStat
              label="On-time delivery"
              value="99.3%"
              hint="Peak hours optimized"
            />
            <HeroStat
              label="Gourmet partners"
              value="320+"
              hint="Chef curated"
            />
            <HeroStat
              label="Loyalty boosters"
              value="₹2.5cr"
              hint="Paid out last month"
            />
            <HeroStat
              label="Live kitchens"
              value="43 zones"
              hint="Tracked in real time"
            />
          </div>
        </div>
      </motion.section>

      {/* SEARCH + FILTER */}
      <div className="max-w-7xl mx-auto mt-10 px-6">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for dishes, chefs, cuisines..."
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-400 transition"
            />
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            {["all", "open", "trending", "new"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                  selectedFilter === filter
                    ? "bg-emerald-400 text-black border-emerald-300"
                    : "bg-white/5 text-gray-300 border-white/10 hover:border-white/30"
                }`}
              >
                {filter === "all"
                  ? "All spots"
                  : filter === "open"
                  ? "Open now"
                  : filter === "trending"
                  ? "Trending"
                  : "New"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto mt-10 px-6 space-y-12">
        <CuratedSections restaurants={restaurants} loading={loading} />
        <RestaurantGrid
          restaurants={filteredRestaurants}
          loading={loading}
          user={user}
        />
      </div>
    </div>
  );
};

const HeroStat = ({ label, value, hint }) => (
  <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-lg">
    <p className="text-sm uppercase tracking-[0.4em] text-gray-400">{label}</p>
    <p className="text-2xl font-bold text-white mt-3">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{hint}</p>
  </div>
);

const CuratedSections = ({ restaurants, loading }) => {
  const trending = restaurants
    .filter((r) => (r.averageRating || 0) >= 4.5)
    .slice(0, 8);
  const flash = restaurants.filter((r) => r.offers?.length).slice(0, 6);
  const lateNight = restaurants
    .filter((r) => r.isOpen && r.operatingHours?.includes("late"))
    .slice(0, 6);

  return (
    <div className="space-y-10">
      {/* ✅ Trending section clickable like All experiences */}
      <CuratedRow
        title="Trending chef drops"
        subtitle="Hot kitchens winning tonight"
        items={trending}
        loading={loading}
        accent="emerald"
        clickable
      />

      <CuratedRow
        title="Flash sales ⚡"
        subtitle="Limited time price slashes"
        items={flash}
        loading={loading}
        accent="amber"
      />

      <CuratedRow
        title="Late-night cloud kitchens"
        subtitle="Ghost kitchens serving past midnight"
        items={lateNight}
        loading={loading}
        accent="violet"
      />
    </div>
  );
};

const CuratedRow = ({ title, subtitle, items, loading, accent, clickable }) => (
  <section>
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>

    {loading ? (
      <RowSkeleton />
    ) : items.length === 0 ? (
      <p className="text-gray-500 text-sm">
        Nothing in this lane yet. Check back soon.
      </p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {items.map((item) =>
          clickable ? (
            <Link
              key={item._id}
              to={`/customer/restaurant/${item._id}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-white/30 transition shadow-lg shadow-black/30 block"
            >
              <div className="relative">
                <img
                  src={item.bannerImage || item.image || "/logo.png"}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-2xl"
                />
                <span
                  className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full bg-${accent}-500/20 text-${accent}-300`}
                >
                  {item.tagline || "Chef curated"}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">{item.name}</h3>
              <p className="text-sm text-gray-400">{item.cuisineType}</p>
              <p className="text-xs text-gray-500 mt-2">
                {item.offers?.[0]?.title || "Neon Rewards eligible"}
              </p>
            </Link>
          ) : (
            <div
              key={item._id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-white/30 transition shadow-lg shadow-black/30"
            >
              <div className="relative">
                <img
                  src={item.bannerImage || item.image || "/logo.png"}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-2xl"
                />
                <span
                  className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full bg-${accent}-500/20 text-${accent}-300`}
                >
                  {item.tagline || "Chef curated"}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">{item.name}</h3>
              <p className="text-sm text-gray-400">{item.cuisineType}</p>
              <p className="text-xs text-gray-500 mt-2">
                {item.offers?.[0]?.title || "Neon Rewards eligible"}
              </p>
            </div>
          )
        )}
      </div>
    )}
  </section>
);

const RowSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {Array.from({ length: 4 }).map((_, idx) => (
      <div
        key={idx}
        className="rounded-2xl border border-white/5 bg-white/5 p-4 animate-pulse space-y-4"
      >
        <div className="w-full h-40 bg-white/10 rounded-2xl" />
        <div className="h-4 bg-white/10 rounded" />
        <div className="h-3 bg-white/10 rounded w-2/3" />
      </div>
    ))}
  </div>
);

const RestaurantGrid = ({ restaurants, loading, user }) => {
  if (loading) return <RowSkeleton />;
  if (!restaurants.length)
    return (
      <div className="text-center text-gray-400 text-sm">
        No restaurants match your filters. Try changing search or check later.
      </div>
    );

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">All experiences</h2>
          <p className="text-sm text-gray-500">
            {restaurants.length}{" "}
            {restaurants.length === 1 ? "chef" : "chefs"} ready for your
            cravings
          </p>
        </div>
        {user ? (
          <Link
            to="/customer/my-orders"
            className="px-4 py-2 rounded-xl border border-white/10 text-sm text-gray-300 hover:border-white/30 transition"
          >
            View my orders
          </Link>
        ) : (
          <Link
            to="/login/customer"
            className="px-4 py-2 rounded-xl bg-emerald-400 text-black text-sm font-semibold shadow-neon hover:bg-emerald-300 transition"
          >
            Sign in for perks
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant._id} restaurant={restaurant} />
        ))}
      </div>
    </section>
  );
};

const RestaurantCard = ({ restaurant }) => {
  const isOpen = restaurant.isOpen;
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-white/10 bg-[#0b1221] overflow-hidden shadow-2xl shadow-black/40"
    >
      <Link to={`/customer/restaurant/${restaurant._id}`}>
        <div className="relative">
          <img
            src={restaurant.bannerImage || restaurant.image || "/logo.png"}
            alt={restaurant.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                isOpen
                  ? "bg-emerald-400 text-black"
                  : "bg-red-500/80 text-white"
              }`}
            >
              {isOpen ? "Open now" : "Closed"}
            </span>
            {restaurant.offers?.length > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/90 text-black">
                {restaurant.offers[0].title || "Offer"}
              </span>
            )}
          </div>
        </div>
        <div className="p-5 space-y-3">
          <h3 className="text-2xl font-bold text-white">{restaurant.name}</h3>
          <p className="text-sm text-gray-400">
            {restaurant.cuisineType || "Multi cuisine"}
          </p>
          <div className="flex justify-between text-sm text-gray-400">
            <span>⭐ {restaurant.averageRating || 4.5}</span>
            <span>{restaurant.estimatedDeliveryTime || "30-45 mins"}</span>
            <span>{restaurant.priceCategory || "₹₹"}</span>
          </div>
          <p className="text-xs text-gray-500">
            {restaurant.tagline || "Experience curated by Neon Eats insights"}
          </p>
        </div>
      </Link>
    </motion.article>
  );
};

export default Home;









