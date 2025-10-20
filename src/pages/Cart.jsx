import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight } from "lucide-react";
import CartItem from "../components/CartItem";

const Cart = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  // ✅ Calculate total price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 🛒 Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <ShoppingCart size={36} className="text-indigo-600" />
            Your Cart
          </h1>
          {cartItems.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/checkout")}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-all"
            >
              Checkout <ArrowRight size={18} />
            </motion.button>
          )}
        </div>

        {/* 🧺 Cart Content */}
        {cartItems.length === 0 ? (
          <div className="text-center bg-white shadow-lg rounded-2xl p-10">
            <img
              src="/empty-cart.svg"
              alt="Empty Cart"
              className="mx-auto w-48 h-48 mb-6 opacity-80"
            />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-4">
              Looks like you haven’t added anything yet.
            </p>
            <Link
              to="/"
              className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-all"
            >
              Start Ordering 🍴
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-3">
                Items in Your Cart
              </h2>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.menuItemId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CartItem item={item} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-24"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
                Order Summary
              </h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={20} />
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;


