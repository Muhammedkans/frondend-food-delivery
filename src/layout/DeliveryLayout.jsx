// src/layout/DeliveryLayout.jsx
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const DeliveryLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Sidebar + Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 p-4 flex flex-col space-y-4">
          <h2 className="text-2xl font-bold text-neon-blue mb-4">Delivery Panel</h2>

          <NavLink
            to="/delivery/dashboard"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md hover:bg-gray-700 transition ${
                isActive ? "bg-neon-blue text-gray-900 font-semibold" : ""
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/delivery/profile"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md hover:bg-gray-700 transition ${
                isActive ? "bg-neon-blue text-gray-900 font-semibold" : ""
              }`
            }
          >
            Profile
          </NavLink>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-900">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DeliveryLayout;


