// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./layout/MainLayout.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import RestaurantLayout from "./layout/RestaurantLayout.jsx";
import DeliveryLayout from "./layout/DeliveryLayout.jsx";

// Pages: Auth
import CustomerLogin from "./pages/Auth/CustomerLogin.jsx";
import CustomerRegister from "./pages/Auth/CustomerRegister.jsx";
import RestaurantLogin from "./pages/Auth/RestaurantLogin.jsx";
import RestaurantRegister from "./pages/Auth/RestaurantRegister.jsx";
import DeliveryLogin from "./pages/Auth/DeliveryLogin.jsx";
import DeliveryRegister from "./pages/Auth/DeliveryRegister.jsx";

// Pages: Customer
import Home from "./pages/Customer/Home.jsx";
import RestaurantMenu from "./pages/Customer/RestaurantMenu.jsx";
import Cart from "./pages/Customer/Cart.jsx";
import Checkout from "./pages/Customer/Checkout.jsx";
import Payment from "./pages/Customer/Payment.jsx";
import OrderSuccess from "./pages/Customer/OrderSuccess.jsx";
import OrderFailed from "./pages/Customer/OrderFailed.jsx";
import OrderTracking from "./pages/Customer/OrderTracking.jsx";
import Profile from "./pages/Customer/Profile.jsx";
import MyOrders from "./pages/Customer/MyOrders.jsx";
import OrderDetails from "./pages/Customer/OrderDetails.jsx";
import Chat from "./pages/Customer/Chat.jsx";
import AiFoodAssistant from "./pages/Customer/AiFoodAssistant.jsx";

// Pages: Admin
import Dashboard from "./pages/Admin/Dashboard.jsx";
import ManageRestaurants from "./pages/Admin/ManageRestaurants.jsx";
import ManageOrders from "./pages/Admin/ManageOrders.jsx";
import ManageDeliveryPartners from "./pages/Admin/ManageDeliveryPartnerss.jsx";

// Pages: Restaurant
import RestaurantDashboard from "./pages/Restaurant/Dashboard.jsx";
import RestaurantMenuPage from "./pages/Restaurant/Menu.jsx";
import RestaurantOrders from "./pages/Restaurant/Orders.jsx";
import RestaurantProfile from "./pages/Restaurant/Profile.jsx";

// Pages: Delivery
import DeliveryDashboard from "./pages/Delivery/Dashboard.jsx";
import DeliveryProfile from "./pages/Delivery/Profile.jsx";

// Utils
import ProtectedRoute from "./utils/ProtectedRoute.jsx";

const App = () => {
  return (
    <Routes>
      {/* ======================= AUTH ROUTES ======================= */}
      <Route path="/login/customer" element={<CustomerLogin />} />
      <Route path="/register/customer" element={<CustomerRegister />} />
      <Route path="/login/restaurant" element={<RestaurantLogin />} />
      <Route path="/register/restaurant" element={<RestaurantRegister />} />
      <Route path="/login/delivery" element={<DeliveryLogin />} />
      <Route path="/register/delivery" element={<DeliveryRegister />} />

      {/* ======================= CUSTOMER ROUTES ======================= */}
      <Route
        path="/"
        element={
          <ProtectedRoute role="customer">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="restaurant/:id" element={<RestaurantMenu />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="payment" element={<Payment />} />
        <Route path="order-success" element={<OrderSuccess />} />
        <Route path="order-failed" element={<OrderFailed />} />
        <Route path="order-tracking/:id" element={<OrderTracking />} />
        <Route path="profile" element={<Profile />} />
        <Route path="my-orders" element={<MyOrders />} />
        <Route path="order/:id" element={<OrderDetails />} />
        <Route path="chat" element={<Chat />} />
        <Route path="ai-food" element={<AiFoodAssistant />} />
      </Route>

      {/* ======================= ADMIN ROUTES ======================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="restaurants" element={<ManageRestaurants />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="delivery-partners" element={<ManageDeliveryPartners />} />
      </Route>

      {/* ======================= RESTAURANT ROUTES ======================= */}
      <Route
        path="/restaurant"
        element={
          <ProtectedRoute role="restaurant">
            <RestaurantLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RestaurantDashboard />} />
        <Route path="menu" element={<RestaurantMenuPage />} />
        <Route path="orders" element={<RestaurantOrders />} />
        <Route path="profile" element={<RestaurantProfile />} />
      </Route>

      {/* ======================= DELIVERY ROUTES ======================= */}
      <Route
        path="/delivery"
        element={
          <ProtectedRoute role="delivery">
            <DeliveryLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DeliveryDashboard />} />
        <Route path="profile" element={<DeliveryProfile />} />
      </Route>

      {/* ======================= 404 PAGE ======================= */}
      <Route path="*" element={<h1 className="text-center mt-20 text-3xl">404 Not Found</h1>} />
    </Routes>
  );
};

export default App;







