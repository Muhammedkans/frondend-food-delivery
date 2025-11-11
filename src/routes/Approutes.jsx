import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Search from "../pages/Search";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Order";
import MyOrder from "../pages/MyOrder";
import RestaurantList from "../pages/RestaurantList"; // ✅ New file
import RestaurantDetails from "../pages/RestaurantDetails"; // ✅ New file
import RestaurantDashboard from "../pages/RestaurantDashboard";
import DeliveryDashboard from "../pages/DeliveryDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Profile from "../pages/Profile";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AppRoutes = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="flex-1 mt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<MyOrder />} />
            <Route path="/restaurants" element={<RestaurantList />} /> {/* ✅ All restaurants */}
            <Route path="/restaurant/:id" element={<RestaurantDetails />} /> {/* ✅ Single restaurant */}
            <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
            <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default AppRoutes;


