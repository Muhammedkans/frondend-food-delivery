// src/components/Navbar/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../slices/userSlice";
import { FiMenu, FiX } from "react-icons/fi";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/"); // after logout go to landing
  };

  // 🔥 Role-based Home path (real-world behavior)
  const getHomePath = () => {
    if (!user) return "/";
    switch (user.role) {
      case "customer":
        return "/customer";
      case "restaurant":
        return "/restaurant";
      case "delivery":
        return "/delivery";
      case "admin":
        return "/admin";
      default:
        return "/";
    }
  };

  // 🔥 Role-based Profile path
  const getProfilePath = () => {
    if (!user) return "/login/customer";
    switch (user.role) {
      case "customer":
        return "/customer/profile";
      case "restaurant":
        return "/restaurant/profile";
      case "delivery":
        return "/delivery/profile";
      case "admin":
        return "/admin"; // or /admin/profile if you create it
      default:
        return "/customer/profile";
    }
  };

  const homePath = getHomePath();
  const profilePath = getProfilePath();

  return (
    <nav className="bg-darkCard/95 shadow-neon-green sticky top-0 w-full z-50 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link
              to={homePath}
              className="text-2xl font-extrabold text-neonGreen hover:text-[#00ffaa] transition-colors neon-text tracking-wide"
            >
              Neon Eats
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-6 text-sm lg:text-base">
            {/* Home (role-aware) */}
            <NavLink
              to={homePath}
              className={({ isActive }) =>
                `pb-1 ${
                  isActive
                    ? "text-neonGreen font-semibold border-b-2 border-neonGreen"
                    : "text-gray-200 hover:text-[#00ffaa] transition-colors"
                }`
              }
            >
              Home
            </NavLink>

            {/* Customer-specific items */}
            {user?.role === "customer" && (
              <>
                <NavLink
                  to="/customer/cart"
                  className="relative text-gray-200 hover:text-[#00ffaa] transition-colors"
                >
                  <FaShoppingCart size={20} />
                  <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full px-1">
                    0
                  </span>
                </NavLink>
                <NavLink
                  to="/customer/my-orders"
                  className={({ isActive }) =>
                    `pb-1 ${
                      isActive
                        ? "text-neonGreen font-semibold border-b-2 border-neonGreen"
                        : "text-gray-200 hover:text-[#00ffaa] transition-colors"
                    }`
                  }
                >
                  My Orders
                </NavLink>
              </>
            )}

            {/* Auth / Profile */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-200 hover:text-[#00ffaa] transition-colors">
                  <FaUserCircle size={22} />
                  <span className="max-w-[120px] truncate">
                    {user.name}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-44 bg-darkCard rounded-lg shadow-neon-green opacity-0 group-hover:opacity-100 transition-opacity neon-text border border-gray-700">
                  <Link
                    to={profilePath}
                    className="block px-4 py-2 text-sm hover:bg-neonGreen/20 rounded-t-lg"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-neonGreen/20 rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <NavLink
                  to="/login/customer"
                  className="text-gray-200 hover:text-[#00ffaa] transition-colors"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register/customer"
                  className="text-gray-200 hover:text-[#00ffaa] transition-colors"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="focus:outline-none text-gray-200">
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-darkCard/95 px-4 pt-2 pb-4 space-y-2 border-t border-gray-700 neon-text animate-pulseGlow">
          {/* Home */}
          <NavLink
            to={homePath}
            className="block text-white hover:text-neonGreen transition-colors"
            onClick={toggleMenu}
          >
            Home
          </NavLink>

          {/* Customer-only options */}
          {user?.role === "customer" && (
            <>
              <NavLink
                to="/customer/cart"
                className="block text-white hover:text-neonGreen transition-colors"
                onClick={toggleMenu}
              >
                Cart
              </NavLink>
              <NavLink
                to="/customer/my-orders"
                className="block text-white hover:text-neonGreen transition-colors"
                onClick={toggleMenu}
              >
                My Orders
              </NavLink>
            </>
          )}

          {user ? (
            <>
              <NavLink
                to={profilePath}
                className="block text-white hover:text-neonGreen transition-colors"
                onClick={toggleMenu}
              >
                Profile
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="block w-full text-left text-white hover:text-neonGreen transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login/customer"
                className="block text-white hover:text-neonGreen transition-colors"
                onClick={toggleMenu}
              >
                Login
              </NavLink>
              <NavLink
                to="/register/customer"
                className="block text-white hover:text-neonGreen transition-colors"
                onClick={toggleMenu}
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;



