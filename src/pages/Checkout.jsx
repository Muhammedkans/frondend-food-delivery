import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import API from '../api/api';
import { clearCart } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const cartItems = useSelector(state => state.cart.cartItems);
  const userInfo = useSelector(state => state.user.userInfo);
  const [address, setAddress] = useState(userInfo?.address || '');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePayment = async () => {
    try {
      const { data } = await API.post(
        '/payments/razorpay',
        { amount: totalPrice * 100, cartItems, address },
        { withCredentials: true }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: data.currency,
        order_id: data.id,
        name: "FoodieAI",
        description: "Food Order Payment",
        handler: async function (response) {
          try {
            await API.post('/payments/confirmation', { ...response, cartItems, address }, { withCredentials: true });
            dispatch(clearCart());
            navigate('/');
            alert('✅ Payment Successful!');
          } catch (err) {
            alert('❌ Payment verification failed.');
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
        },
        theme: { color: "#ef4444" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
          🛍️ Secure Checkout
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            Your cart is empty. <br />
            <span
              onClick={() => navigate('/')}
              className="text-red-500 hover:underline cursor-pointer"
            >
              Go back and add items!
            </span>
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Side - Address Section */}
            <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                📍 Shipping Address
              </h2>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full delivery address..."
                rows="6"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-400 focus:outline-none text-gray-700"
              ></textarea>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">👤 Customer Info</h3>
                <p className="text-gray-600"><strong>Name:</strong> {userInfo?.name}</p>
                <p className="text-gray-600"><strong>Email:</strong> {userInfo?.email}</p>
              </div>
            </div>

            {/* Right Side - Order Summary */}
            <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-8 border border-gray-100 h-fit">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                🧾 Order Summary
              </h2>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="flex justify-between py-3 text-gray-700"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between text-xl font-bold text-gray-800">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>

              <button
                onClick={handlePayment}
                className="mt-8 w-full py-3 bg-gradient-to-r from-red-500 to-orange-400 text-white font-semibold text-lg rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                💳 Pay ₹{totalPrice} Securely
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;


