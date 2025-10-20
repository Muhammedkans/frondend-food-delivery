import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand & Description */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-red-500 mb-2">FoodieAI</h2>
          <p className="text-gray-400">
            Delivering delicious food with AI-powered suggestions, real-time tracking, and a seamless experience.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="text-center md:text-left">
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li>
              <Link to="/" className="hover:text-red-500 transition">Home</Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-red-500 transition">Cart</Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-red-500 transition">Profile</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-red-500 transition">Login</Link>
            </li>
            <li>
              <Link to="/signup" className="hover:text-red-500 transition">Signup</Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="text-center md:text-left">
          <h3 className="font-semibold mb-2">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-4 mt-2">
            <a href="https://facebook.com" target="_blank" className="hover:text-blue-500 transition">
              <Facebook size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" className="hover:text-blue-400 transition">
              <Twitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" className="hover:text-pink-500 transition">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-6 py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} FoodieAI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;


