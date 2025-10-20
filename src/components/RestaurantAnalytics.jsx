import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const RestaurantAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await API.get('/analytics');
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchAnalytics();
  }, []);

  if (!analytics) return <p className="text-gray-500 mt-4">Loading analytics...</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-md p-6 rounded-lg text-center">
          <p className="text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-green-500">₹{analytics.totalRevenue}</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-lg text-center">
          <p className="text-gray-500">Active Orders</p>
          <p className="text-2xl font-bold text-blue-500">{analytics.activeOrders}</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-lg text-center">
          <p className="text-gray-500">Best-selling Dish</p>
          <p className="text-2xl font-bold text-red-500">{analytics.bestSellingDishes[0]?.name || '-'}</p>
        </div>
      </div>

      <div className="bg-white shadow-md p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Top 5 Best-selling Dishes</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.bestSellingDishes}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#F87171" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default RestaurantAnalytics;
