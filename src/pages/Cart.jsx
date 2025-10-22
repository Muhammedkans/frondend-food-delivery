import React, { useEffect, useState } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Increase or decrease quantity
  const updateQuantity = async (dishId, quantity) => {
    if (quantity < 1) return;
    try {
      const res = await api.put('/cart', { dishId, quantity });
      setCart(res.data.cart);
      toast.success('Cart updated!');
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    }
  };

  // Remove item from cart
  const removeItem = async (dishId) => {
    try {
      const res = await api.delete('/cart', { data: { dishId } });
      setCart(res.data.cart);
      toast.success('Item removed!');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  if (loading) return <Loader />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Navbar />
        <h2 className="text-2xl font-semibold mt-20">Your cart is empty</h2>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="p-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

        <div className="space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.dish._id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.dish.image || '/assets/images/default-dish.png'}
                  alt={item.dish.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-xl font-semibold">{item.dish.name}</h3>
                  <p className="text-gray-500">₹ {item.dish.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() => updateQuantity(item.dish._id, item.quantity - 1)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() => updateQuantity(item.dish._id, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => removeItem(item.dish._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end items-center gap-4">
          <p className="text-xl font-semibold">
            Total: ₹{' '}
            {cart.items.reduce((acc, item) => acc + item.dish.price * item.quantity, 0)}
          </p>
          <a
            href="/checkout"
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Checkout
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Cart;



