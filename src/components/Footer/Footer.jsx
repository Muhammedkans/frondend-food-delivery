// Footer.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaInstagram, FaTwitter, FaFacebook, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-t from-[#0a0f1f] to-[#030711] border-t border-gray-800 mt-20 text-gray-300"
    >
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* BRAND INFO */}
        <div className="space-y-4">
          <h1 className="text-2xl font-extrabold text-neonGreen tracking-widest glow-neon">
            Neon Eats
          </h1>
          <p className="text-gray-400 text-sm">
            Futuristic cloud kitchens, AI-powered recommendations, and lightning-fast delivery — all curated for you.
          </p>
          <div className="flex gap-4 mt-2 text-neonGreen">
            <a href="#" className="hover:text-emerald-400 glow-neon transition"><FaInstagram size={20} /></a>
            <a href="#" className="hover:text-emerald-400 glow-neon transition"><FaTwitter size={20} /></a>
            <a href="#" className="hover:text-emerald-400 glow-neon transition"><FaFacebook size={20} /></a>
            <a href="#" className="hover:text-emerald-400 glow-neon transition"><FaYoutube size={20} /></a>
          </div>
        </div>

        {/* NAV LINKS */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white glow-neon">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/customer/restaurants" className="hover:text-emerald-400 glow-neon transition">Restaurants</Link></li>
            <li><Link to="/customer/my-orders" className="hover:text-emerald-400 glow-neon transition">My Orders</Link></li>
            <li><Link to="/customer/ai-assistant" className="hover:text-emerald-400 glow-neon transition">AI Assistant</Link></li>
            <li><Link to="/customer/contact" className="hover:text-emerald-400 glow-neon transition">Contact Us</Link></li>
          </ul>
        </div>

        {/* CONTACT INFO */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white glow-neon">Contact</h3>
          <p className="text-gray-400 text-sm">123 Neon Street, Cyber City</p>
          <p className="text-gray-400 text-sm">support@neoneats.com</p>
          <p className="text-gray-400 text-sm">+91 98765 43210</p>
        </div>

        {/* NEWSLETTER */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white glow-neon">Subscribe</h3>
          <p className="text-gray-400 text-sm">
            Get the latest chef drops, deals, and offers directly in your inbox.
          </p>
          <form className="flex gap-2 mt-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-xl bg-[#111827] border border-gray-700 text-gray-200 focus:outline-none focus:border-neonGreen placeholder-gray-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-neonGreen text-black font-semibold rounded-xl hover:bg-emerald-400 glow-neon transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 text-center py-4 text-gray-500 text-xs">
        © {new Date().getFullYear()} Neon Eats. All rights reserved. Crafted with 💚 for the neon generation.
      </div>

      
    </motion.footer>
  );
};

export default Footer;



