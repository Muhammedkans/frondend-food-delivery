// src/components/Footer/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-darkCard text-gray-200 mt-10 border-t border-gray-700 neon-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Logo & Description */}
        <div>
          <h1 className="text-2xl font-bold text-neonGreen mb-2 neon-text">
            Neon Eats
          </h1>
          <p className="text-gray-400 text-sm">
            Premium futuristic food delivery experience. Dark mode, neon accents, smooth animations, all in one.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="font-semibold text-white mb-2 neon-text">Quick Links</h2>
          <ul className="space-y-1">
            <li>
              <Link
                to="/customer"
                className="hover:text-neonGreen transition-colors neon-text"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/customer/my-orders"
                className="hover:text-neonGreen transition-colors neon-text"
              >
                My Orders
              </Link>
            </li>
            <li>
              <Link
                to="/customer/profile"
                className="hover:text-neonGreen transition-colors neon-text"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/customer/ai-food"
                className="hover:text-neonGreen transition-colors neon-text"
              >
                AI Food Assistant
              </Link>
            </li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h2 className="font-semibold text-white mb-2 neon-text">About</h2>
          <ul className="space-y-1">
            <li>
              <Link
                to="/about"
                className="hover:text-neonGreen transition-colors neon-text"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-neonGreen transition-colors neon-text"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="hover:text-neonGreen transition-colors neon-text"
              >
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="hover:text-neonGreen transition-colors neon-text"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="font-semibold text-white mb-2 neon-text">Follow Us</h2>
          <div className="flex space-x-4 mt-2">
            <a
              href="#"
              className="text-gray-400 hover:text-neonGreen transition-colors neon-text"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-neonGreen transition-colors neon-text"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-neonGreen transition-colors neon-text"
            >
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-500 text-sm neon-text">
        &copy; {new Date().getFullYear()} Neon Eats. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

