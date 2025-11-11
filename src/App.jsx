import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

// ✅ Auth Pages (Soon we will create them)
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// ✅ Customer Pages
import Home from "./pages/customer/Home";
import RestaurantMenu from "./pages/customer/RestaurantMenu";
import CartPage from "./pages/customer/CartPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import OrderSuccess from "./pages/customer/OrderSuccess";
import MyOrders from "./pages/customer/MyOrders";
import TrackOrder from "./pages/customer/TrackOrder";
import AIAssistant from "./pages/customer/AIAssistant";

// ✅ Restaurant Pages
import RDashboard from "./pages/restaurant/RDashboard";
import ROrders from "./pages/restaurant/ROrders";
import AddDish from "./pages/restaurant/AddDish";
import EditDish from "./pages/restaurant/EditDish";

// ✅ Delivery Pages
import DDashboard from "./pages/delivery/DDashboard";
import DActiveOrders from "./pages/delivery/DActiveOrders";

// ✅ Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminRestaurants from "./pages/admin/AdminRestaurants";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminDeliveryPartners from "./pages/admin/AdminDeliveryPartners";

import Home from "./pages/Customer/Home";



        import CustomerLogin from "./pages/Auth/CustomerLogin";
import CustomerRegister from "./pages/Auth/CustomerRegister";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/profile" element={<Profile />} />

        {/* ✅ CUSTOMER ROUTES */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/restaurant/:id" element={<RestaurantMenu />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/success" element={<OrderSuccess />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/track-order/:orderId" element={<TrackOrder />} />
          <Route path="/ai" element={<AIAssistant />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order-success" element={<OrderSuccess />} />
 

        </Route>

        {/* ✅ RESTAURANT ROUTES */}
        <Route path="/restaurant/dashboard" element={<RDashboard />} />
        <Route path="/restaurant/orders" element={<ROrders />} />
        <Route path="/restaurant/add-dish" element={<AddDish />} />
        <Route path="/restaurant/edit-dish/:dishId" element={<EditDish />} />

        {/* ✅ DELIVERY ROUTES */}
        <Route path="/delivery/dashboard" element={<DDashboard />} />
        <Route path="/delivery/active-orders" element={<DActiveOrders />} />


        {/* ✅ ADMIN */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<OrdersAdmin />} />
        <Route path="/admin/restaurants" element={<AdminRestaurants />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/admin/delivery-partners" element={<AdminDeliveryPartners />} />




<Route path="/" element={<Home />} />
<Route path="/restaurant/:restaurantId" element={<RestaurantMenu />} />

<Route path="/cart" element={<Cart />} />


<Route path="/customer/login" element={<CustomerLogin />} />
<Route path="/customer/register" element={<CustomerRegister />} />


<Route path="/checkout" element={<Checkout />} />

<Route path="/payment" element={<Payment />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;





