// src/pages/Admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import adminApi from "../../api/adminApi";
import { FaUtensils, FaUserTie, FaClipboardList, FaMotorcycle } from "react-icons/fa";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalOrders: 0,
    totalDeliveryPartners: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.getDashboardStats();
        setStats(res.data.stats);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold text-neonGreen mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Restaurants */}
          <div className="p-6 bg-gray-800 rounded-2xl flex flex-col items-center text-neonGreen shadow-lg hover:scale-105 transform transition">
            <FaUtensils size={40} />
            <h2 className="text-xl mt-2">Restaurants</h2>
            <p className="text-2xl font-bold mt-1">{stats.totalRestaurants}</p>
          </div>

          {/* Total Orders */}
          <div className="p-6 bg-gray-800 rounded-2xl flex flex-col items-center text-neonBlue shadow-lg hover:scale-105 transform transition">
            <FaClipboardList size={40} />
            <h2 className="text-xl mt-2">Orders</h2>
            <p className="text-2xl font-bold mt-1">{stats.totalOrders}</p>
          </div>

          {/* Total Delivery Partners */}
          <div className="p-6 bg-gray-800 rounded-2xl flex flex-col items-center text-neonPurple shadow-lg hover:scale-105 transform transition">
            <FaMotorcycle size={40} />
            <h2 className="text-xl mt-2">Delivery Partners</h2>
            <p className="text-2xl font-bold mt-1">{stats.totalDeliveryPartners}</p>
          </div>

          {/* Total Customers */}
          <div className="p-6 bg-gray-800 rounded-2xl flex flex-col items-center text-neonPink shadow-lg hover:scale-105 transform transition">
            <FaUserTie size={40} />
            <h2 className="text-xl mt-2">Customers</h2>
            <p className="text-2xl font-bold mt-1">{stats.totalCustomers}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
