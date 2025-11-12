import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-10 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Logo & Description */}
        <div>
          <h1 className="text-2xl font-bold text-green-400 mb-2">FoodNeon</h1>
          <p className="text-gray-400 text-sm">
            Premium futuristic food delivery experience. Dark mode, neon accents, smooth animations, all in one.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="font-semibold text-white mb-2">Quick Links</h2>
          <ul className="space-y-1">
            <li>
              <Link to="/" className="hover:text-green-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/my-orders" className="hover:text-green-400 transition-colors">
                My Orders
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-green-400 transition-colors">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/ai-food-assistant" className="hover:text-green-400 transition-colors">
                AI Food Assistant
              </Link>
            </li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h2 className="font-semibold text-white mb-2">About</h2>
          <ul className="space-y-1">
            <li>
              <Link to="/about" className="hover:text-green-400 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-green-400 transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-green-400 transition-colors">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-green-400 transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="font-semibold text-white mb-2">Follow Us</h2>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} FoodNeon. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
