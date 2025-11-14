// src/layout/MainLayout.jsx
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";
import { motion } from "framer-motion";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-darkBg text-white">
      {/* Navbar */}
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <motion.aside
          initial={{ width: 0 }}
          animate={{ width: sidebarOpen ? 256 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="bg-darkCard shadow-neon-green overflow-hidden z-20 relative"
        >
          <div className="p-6 flex flex-col h-full">
            <button
              className="text-neonGreen font-bold mb-6 hover:text-[#00ffaa] transition-all duration-300"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? "Close Menu ✖" : "Open Menu ☰"}
            </button>

            <nav className="flex flex-col space-y-4 mt-4">
              <Link
                to="/customer"
                className="px-4 py-3 rounded-xl hover:bg-neonGreen/20 transition-all duration-300 text-lg font-semibold neon-text"
              >
                Home
              </Link>
              <Link
                to="/customer/cart"
                className="px-4 py-3 rounded-xl hover:bg-neonGreen/20 transition-all duration-300 text-lg font-semibold neon-text"
              >
                Cart
              </Link>
              <Link
                to="/customer/my-orders"
                className="px-4 py-3 rounded-xl hover:bg-neonGreen/20 transition-all duration-300 text-lg font-semibold neon-text"
              >
                My Orders
              </Link>
              <Link
                to="/customer/profile"
                className="px-4 py-3 rounded-xl hover:bg-neonGreen/20 transition-all duration-300 text-lg font-semibold neon-text"
              >
                Profile
              </Link>
              <Link
                to="/customer/ai-food"
                className="px-4 py-3 rounded-xl hover:bg-neonGreen/20 transition-all duration-300 text-lg font-semibold neon-text"
              >
                AI Food Assistant
              </Link>
            </nav>

            {/* Neon Glow Footer */}
            <div className="mt-auto text-center text-sm text-gray-400 neon-text/50">
              Neon Eats © 2025
            </div>
          </div>

          {/* Neon Sidebar Glow */}
          <div className="absolute inset-0 pointer-events-none border-r-2 border-neonGreen glow-animate"></div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto bg-darkCard/70 backdrop-blur-xl relative shadow-neon-green rounded-3xl mx-4 my-4">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;






