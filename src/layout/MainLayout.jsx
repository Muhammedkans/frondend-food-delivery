import { Outlet, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MainLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* ✅ NAVBAR */}
      <nav className="px-6 py-4 backdrop-blur-md bg-white/5 border-b border-white/10 flex justify-between items-center sticky top-0 z-50">
        
        {/* ✅ Logo */}
        <motion.h1
          className="text-2xl font-bold tracking-wide neon-green"
          whileHover={{ scale: 1.05 }}
        >
          <Link to="/">FoodX</Link>
        </motion.h1>

        {/* ✅ Nav Items */}
        <div className="flex items-center gap-6">
          <Link
            to="/cart"
            className="text-lg hover:text-[#00ff9d] transition-all duration-200"
          >
            Cart
          </Link>

          <Link
            to="/orders"
            className="text-lg hover:text-[#00ff9d] transition-all duration-200"
          >
            My Orders
          </Link>

          <Link
            to="/ai"
            className="text-lg hover:text-[#00ff9d] transition-all duration-200"
          >
            AI Assistant
          </Link>

          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-[#00ff9d] text-black rounded-xl font-semibold hover:bg-[#00ffaa] transition-all shadow-[0_0_10px_#00ff9d]"
          >
            Login
          </button>
        </div>
      </nav>

      {/* ✅ PAGE CONTENT */}
      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;
