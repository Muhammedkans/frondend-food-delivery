// src/components/Navbar/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../slices/userSlice";
import { FiMenu, FiX } from "react-icons/fi";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav className="bg-darkCard shadow-neon-green fixed w-full z-50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-neonGreen hover:text-[#00ffaa] transition-colors neon-text"
            >
              Neon Eats
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-neonGreen font-semibold border-b-2 border-neonGreen"
                  : "hover:text-[#00ffaa] transition-colors"
              }
            >
              Home
            </NavLink>

            {user?.role === "customer" && (
              <>
                <NavLink
                  to="/customer/cart"
                  className="relative hover:text-[#00ffaa] transition-colors"
                >
                  <FaShoppingCart size={20} />
                  <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full px-1">
                    0
                  </span>
                </NavLink>
                <NavLink
                  to="/customer/my-orders"
                  className="hover:text-[#00ffaa] transition-colors"
                >
                  My Orders
                </NavLink>
              </>
            )}

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 hover:text-[#00ffaa] transition-colors">
                  <FaUserCircle size={22} />
                  <span>{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-darkCard rounded-lg shadow-neon-green opacity-0 group-hover:opacity-100 transition-opacity neon-text">
                  <Link
                    to="/customer/profile"
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
                  className="hover:text-[#00ffaa] transition-colors"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register/customer"
                  className="hover:text-[#00ffaa] transition-colors"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="focus:outline-none">
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-darkCard px-4 pt-2 pb-4 space-y-2 border-t border-gray-700 neon-text animate-pulseGlow">
          <NavLink
            to="/"
            className="block text-white hover:text-neonGreen transition-colors"
            onClick={toggleMenu}
          >
            Home
          </NavLink>

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
                to="/customer/profile"
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

