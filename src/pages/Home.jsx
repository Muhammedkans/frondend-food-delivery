// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRestaurants } from '../redux/slices/restaurantSlice';
import RestaurantCard from '../components/RestaurantCard';
import MenuItemCard from '../components/MenuItemCard';
import API from '../api/api';
import { AiOutlineStar } from 'react-icons/ai';

const SkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-3xl shadow-md animate-pulse p-6 h-72"
      />
    ))}
  </div>
);

const Home = () => {
  const dispatch = useDispatch();
  const { restaurants = [], loading, error } =
    useSelector((s) => s.restaurants || { restaurants: [], loading: false });
  const { userInfo } = useSelector((s) => s.user || {});

  const [recommended, setRecommended] = useState([]);
  const [recLoading, setRecLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  // Fetch AI recommendations
  useEffect(() => {
    const loadAI = async () => {
      if (!userInfo?.role || userInfo.role !== 'customer') return;
      try {
        setRecLoading(true);
        const { data } = await API.get('/ai/suggestions', {
          withCredentials: true,
        });
        const items = Array.isArray(data.suggestions) ? data.suggestions : [];
        setRecommended(items);
      } catch (err) {
        console.warn('AI fetch failed', err);
      } finally {
        setRecLoading(false);
      }
    };
    loadAI();
  }, [userInfo]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}


        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
              Discover Delicious Meals Near You
            </h1>
            <p className="text-gray-600 text-lg">
              Explore top restaurants & enjoy AI-powered recommendations
            </p>
          </div>
        </header>

        {/* AI Recommendations */}
        {userInfo?.role === 'customer' && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Recommended for You
              </h2>
              <small className="text-sm text-gray-500">Personalized</small>
            </div>

            {recLoading ? (
              <div className="flex gap-6 overflow-x-auto pb-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-64 h-48 bg-white rounded-2xl shadow-md animate-pulse flex-shrink-0"
                  />
                ))}
              </div>
            ) : recommended.length === 0 ? (
              <div className="text-gray-500 italic">
                No recommendations yet — order a few items so AI can learn your
                taste!
              </div>
            ) : (
              <div className="flex gap-6 overflow-x-auto pb-4">
                {recommended.map((item) =>
                  typeof item === 'string' ? (
                    <div
                      key={item}
                      className="w-64 p-4 bg-white rounded-2xl shadow-md flex-shrink-0 hover:scale-105 transform transition-all duration-300"
                    >
                      <div className="font-semibold text-gray-800">{item}</div>
                    </div>
                  ) : (
                    <MenuItemCard key={item._id} menuItem={item} />
                  )
                )}
              </div>
            )}
          </section>
        )}

        {/* Restaurants Grid */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">
              All Restaurants
            </h2>
            <div className="text-sm text-gray-500">{restaurants.length} places</div>
          </div>

          {loading ? (
            <SkeletonGrid />
          ) : error ? (
            <div className="text-red-500 font-medium">{error}</div>
          ) : restaurants.length === 0 ? (
            <div className="text-gray-500 italic">No restaurants found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {restaurants.map((r) => (
                <RestaurantCard key={r._id} restaurant={r} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;






