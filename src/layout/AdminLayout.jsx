// src/layout/AdminLayout.jsx
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Sidebar + Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 p-4 flex flex-col space-y-4">
          <h2 className="text-2xl font-bold text-neon-green mb-4">Admin Panel</h2>

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md hover:bg-gray-700 transition ${
                isActive ? "bg-neon-green text-gray-900 font-semibold" : ""
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/manage-restaurants"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md hover:bg-gray-700 transition ${
                isActive ? "bg-neon-green text-gray-900 font-semibold" : ""
              }`
            }
          >
            Restaurants
          </NavLink>

          <NavLink
            to="/admin/manage-orders"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md hover:bg-gray-700 transition ${
                isActive ? "bg-neon-green text-gray-900 font-semibold" : ""
              }`
            }
          >
            Orders
          </NavLink>

          <NavLink
            to="/admin/manage-delivery-partners"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md hover:bg-gray-700 transition ${
                isActive ? "bg-neon-green text-gray-900 font-semibold" : ""
              }`
            }
          >
            Delivery Partners
          </NavLink>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-900">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminLayout;



