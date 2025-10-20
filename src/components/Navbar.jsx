import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/userSlice";
import { ShoppingCart, User } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold text-red-500 hover:text-red-600 transition">
          FoodieAI
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 font-medium text-gray-700">
          <Link to="/" className="hover:text-red-500 transition">Home</Link>
          {userInfo && userInfo.role === "customer" && (
            <Link to="/cart" className="relative hover:text-red-500 transition flex items-center">
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1.5 animate-pulse">
                  {cartItems.length}
                </span>
              )}
            </Link>
          )}

          {userInfo ? (
            <div className="flex items-center space-x-3">
              <span className="flex items-center gap-1 text-gray-800 font-semibold">
                <User size={18} /> {userInfo.name}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:text-red-500 transition">Login</Link>
              <Link
                to="/signup"
                className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-3 font-medium text-gray-700">
          <Link to="/" className="block hover:text-red-500 transition" onClick={() => setMenuOpen(false)}>Home</Link>
          {userInfo && userInfo.role === "customer" && (
            <Link to="/cart" className="block relative hover:text-red-500 transition" onClick={() => setMenuOpen(false)}>
              Cart
              {cartItems.length > 0 && (
                <span className="absolute top-1 right-4 bg-red-500 text-white text-xs rounded-full px-1.5 animate-pulse">
                  {cartItems.length}
                </span>
              )}
            </Link>
          )}
          {userInfo ? (
            <>
              <span className="block">{userInfo.name}</span>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block hover:text-red-500 transition" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link
                to="/signup"
                className="block px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                onClick={() => setMenuOpen(false)}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

