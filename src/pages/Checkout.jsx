import React, { useEffect, useState } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('');

  // Fetch cart data
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

  // Razorpay payment handler
  const handlePayment = async () => {
    if (!address) return toast.error('Please enter your delivery address');

    try {
      // 1️⃣ Create order on backend
      const orderRes = await api.post('/checkout', {
        address,
      });

      const { amount, id: order_id, currency } = orderRes.data;

      // 2️⃣ Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, // Razorpay key from .env
        amount: amount * 100, // in paise
        currency: currency,
        name: 'SwiggyX',
        description: 'Food Order Payment',
        order_id: order_id,
        handler: async function (response) {
          // 3️⃣ Confirm payment on backend
          try {
            await api.post('/payment/confirmation', response);
            toast.success('Payment successful! Your order is confirmed.');
            window.location.href = '/myorders';
          } catch (err) {
            console.error(err);
            toast.error('Payment confirmation failed');
          }
        },
        prefill: {
          name: '',   // Optional: fetch from user profile
          email: '',  // Optional
        },
        theme: {
          color: '#F97316', // Custom top-level orange
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error('Failed to initiate payment');
    }
  };

  const totalAmount = cart.items.reduce(
    (acc, item) => acc + item.dish.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="p-4 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Checkout</h2>

        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <label className="block font-semibold">Delivery Address:</label>
          <textarea
            className="w-full border rounded p-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your delivery address"
          ></textarea>

          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Order Summary:</h3>
            <ul className="space-y-2">
              {cart.items.map((item) => (
                <li key={item.dish._id} className="flex justify-between">
                  <span>
                    {item.dish.name} x {item.quantity}
                  </span>
                  <span>₹ {item.dish.price * item.quantity}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-lg font-bold">Total: ₹ {totalAmount}</p>
          </div>

          <button
            onClick={handlePayment}
            className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded font-semibold"
          >
            Pay with Razorpay
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Checkout;



