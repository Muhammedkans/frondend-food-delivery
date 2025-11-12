// src/pages/Customer/Cart.jsx
import React, { useEffect, useState } from "react";
import customerApi from "../../api/customerApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch Cart on Page Load
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await customerApi.getCart();
      setCart(res.data.cart);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Increase Quantity
  const increaseQty = async (item) => {
    try {
      const res = await customerApi.updateCartItem({
        dishId: item.dish._id,
        quantity: item.quantity + 1,
      });
      setCart(res.data.cart);
    } catch (err) {
      toast.error("Error updating cart");
    }
  };

  // ✅ Decrease Quantity
  const decreaseQty = async (item) => {
    if (item.quantity === 1) {
      removeItem(item.dish._id);
      return;
    }

    try {
      const res = await customerApi.updateCartItem({
        dishId: item.dish._id,
        quantity: item.quantity - 1,
      });
      setCart(res.data.cart);
    } catch (err) {
      toast.error("Error updating cart");
    }
  };

  // ✅ Remove Item
  const removeItem = async (dishId) => {
    try {
      const res = await customerApi.removeFromCart(dishId);
      setCart(res.data.cart);
      toast.success("Item removed");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  // ✅ Clear Cart
  const clearCart = async () => {
    try {
      await customerApi.clearCart();
      setCart([]);
      toast.success("Cart cleared");
    } catch (err) {
      toast.error("Failed to clear cart");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-green-400 text-2xl mt-20">
        Loading Cart...
      </div>
    );
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold neon-text mb-4">Your Cart is Empty</h2>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-green-500 text-black rounded-lg font-semibold hover:bg-green-600 transition-all"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold neon-text mb-6 text-center">
        Your Cart
      </h1>

      <div className="max-w-3xl mx-auto space-y-6">
        {cart.items.map((item) => (
          <div
            key={item.dish._id}
            className="flex items-center bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-lg"
          >
            <img
              src={item.dish.imageUrl || "/logo.png"}
              alt={item.dish.name}
              className="w-24 h-24 object-cover rounded-lg"
            />

            <div className="flex-1 px-4">
              <h2 className="text-xl font-bold neon-text">{item.dish.name}</h2>
              <p className="text-gray-400">${item.dish.price}</p>
            </div>

            {/* Quantity Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => decreaseQty(item)}
                className="px-3 py-1 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                -
              </button>

              <span className="px-4 py-1 bg-gray-700 rounded-lg text-green-400 font-bold">
                {item.quantity}
              </span>

              <button
                onClick={() => increaseQty(item)}
                className="px-3 py-1 bg-green-500 text-black rounded-lg hover:bg-green-600"
              >
                +
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeItem(item.dish._id)}
              className="ml-6 text-red-500 font-semibold hover:text-red-400"
            >
              Remove
            </button>
          </div>
        ))}

        {/* Total & Checkout */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 mt-6">
          <h2 className="text-2xl font-bold mb-3">Total: 
            <span className="text-green-400 ml-2">${cart.totalPrice}</span>
          </h2>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/checkout")}
              className="flex-1 py-3 bg-green-500 text-black rounded-lg font-semibold hover:bg-green-600 transition-all"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={clearCart}
              className="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;


