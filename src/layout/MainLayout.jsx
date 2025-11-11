// src/layout/MainLayout.jsx
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Optional Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-0"
          } bg-gray-800 transition-all duration-300 overflow-hidden`}
        >
          <div className="p-4">
            <button
              className="text-gray-300 hover:text-white mb-4"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? "Close" : "Open"}
            </button>

            <nav className="space-y-2">
              <Link
                to="/"
                className="block p-2 rounded hover:bg-gray-700 transition"
              >
                Home
              </Link>
              <Link
                to="/cart"
                className="block p-2 rounded hover:bg-gray-700 transition"
              >
                Cart
              </Link>
              <Link
                to="/my-orders"
                className="block p-2 rounded hover:bg-gray-700 transition"
              >
                My Orders
              </Link>
              <Link
                to="/profile"
                className="block p-2 rounded hover:bg-gray-700 transition"
              >
                Profile
              </Link>
              <Link
                to="/ai-food-assistant"
                className="block p-2 rounded hover:bg-gray-700 transition"
              >
                AI Food Assistant
              </Link>
            </nav>
          </div>
        </aside>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet /> {/* React Router Outlet for child pages */}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;


