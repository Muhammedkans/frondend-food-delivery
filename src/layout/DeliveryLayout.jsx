// src/layout/DeliveryLayout.jsx
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { FiHome, FiUser } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";

const DeliveryLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1f] text-white">

      {/* Top Navbar */}
      <Navbar />

      {/* Sidebar + Content */}
      <div className="flex flex-1 mt-16">

        {/* LEFT SIDEBAR */}
        <aside className="w-64 bg-[#0e152b] backdrop-blur-xl border-r border-[#1a2340] p-4 flex flex-col space-y-4 shadow-xl">

          <h2 className="text-xl font-bold text-neonGreen mb-3 tracking-wide">
            Delivery Partner Panel
          </h2>

          {/* Dashboard */}
          <NavLink
            to="/delivery"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium
              hover:bg-[#1b2a4a] hover:text-neonGreen
              ${isActive ? "bg-neonGreen text-black shadow-lg" : ""}`
            }
          >
            <MdDashboard size={20} />
            Dashboard
          </NavLink>

          {/* Profile */}
          <NavLink
            to="/delivery/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium
              hover:bg-[#1b2a4a] hover:text-neonGreen
              ${isActive ? "bg-neonGreen text-black shadow-lg" : ""}`
            }
          >
            <FiUser size={20} />
            Profile
          </NavLink>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-8 bg-[#0a0f1f] overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DeliveryLayout;


