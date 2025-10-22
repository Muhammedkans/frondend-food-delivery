import React, { useEffect, useState } from 'react';
import api from '../api/api';
import DishCard from '../components/DishCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get('/restaurant'); // fetch all restaurants
        setRestaurants(res.data.restaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="p-4">
        <h2 className="text-3xl font-bold mb-4">Top Restaurants</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {restaurants.map((rest) => (
            <DishCard key={rest._id} restaurant={rest} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;







