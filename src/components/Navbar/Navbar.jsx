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
    <nav className="bg-gray-900 text-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-green-400 hover:text-green-300 transition-colors">
              FoodNeon
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-green-400 font-semibold border-b-2 border-green-400"
                  : "hover:text-green-300 transition-colors"
              }
            >
              Home
            </NavLink>
            {user?.role === "customer" && (
              <>
                <NavLink to="/cart" className="relative hover:text-green-300 transition-colors">
                  <FaShoppingCart size={20} />
                  <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full px-1">
                    {/* TODO: Add cart count from Redux */}
                    0
                  </span>
                </NavLink>
                <NavLink to="/my-orders" className="hover:text-green-300 transition-colors">
                  My Orders
                </NavLink>
              </>
            )}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 hover:text-green-300 transition-colors">
                  <FaUserCircle size={22} />
                  <span>{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-700 rounded-t-lg"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <NavLink to="/login" className="hover:text-green-300 transition-colors">
                  Login
                </NavLink>
                <NavLink to="/register" className="hover:text-green-300 transition-colors">
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
        <div className="md:hidden bg-gray-900 px-4 pt-2 pb-4 space-y-2 border-t border-gray-700">
          <NavLink
            to="/"
            className="block text-white hover:text-green-300 transition-colors"
            onClick={toggleMenu}
          >
            Home
          </NavLink>
          {user?.role === "customer" && (
            <>
              <NavLink
                to="/cart"
                className="block text-white hover:text-green-300 transition-colors"
                onClick={toggleMenu}
              >
                Cart
              </NavLink>
              <NavLink
                to="/my-orders"
                className="block text-white hover:text-green-300 transition-colors"
                onClick={toggleMenu}
              >
                My Orders
              </NavLink>
            </>
          )}
          {user ? (
            <>
              <NavLink
                to="/profile"
                className="block text-white hover:text-green-300 transition-colors"
                onClick={toggleMenu}
              >
                Profile
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="block w-full text-left text-white hover:text-green-300 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="block text-white hover:text-green-300 transition-colors"
                onClick={toggleMenu}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="block text-white hover:text-green-300 transition-colors"
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
