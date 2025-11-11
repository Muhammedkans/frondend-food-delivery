// src/pages/Customer/Checkout.jsx
import React, { useEffect, useState } from "react";
import customerApi from "../../api/customerApi";
import paymentApi from "../../api/paymentApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod = Cash on Delivery, razorpay = online
  const navigate = useNavigate();

  // ✅ Fetch Cart
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await customerApi.getCart();
      setCart(res.data.cart);
    } catch (err) {
      toast.error("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Place Order
  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error("Please enter delivery address");
      return;
    }

    try {
      if (paymentMethod === "cod") {
        // ✅ Cash on Delivery
        const res = await customerApi.placeOrder({ address, paymentMethod });
        toast.success("Order placed successfully!");
        navigate(`/order-success/${res.data.order._id}`);
      } else {
        // ✅ Razorpay Payment
        const res = await paymentApi.createOrder({ amount: cart.totalPrice * 100 }); // amount in paise
        const { orderId, key } = res.data;

        const options = {
          key,
          amount: cart.totalPrice * 100,
          currency: "INR",
          name: "Food Delivery App",
          description: "Order Payment",
          order_id: orderId,
          handler: async function (response) {
            // ✅ Verify payment on backend
            try {
              await paymentApi.verifyPayment(response);
              const orderRes = await customerApi.placeOrder({
                address,
                paymentMethod: "razorpay",
              });
              toast.success("Order placed successfully!");
              navigate(`/order-success/${orderRes.data.order._id}`);
            } catch (err) {
              toast.error("Payment verification failed");
            }
          },
          theme: {
            color: "#00FF7F", // Neon Green
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-green-400 text-2xl mt-20">
        Loading Checkout...
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
        Checkout
      </h1>

      {/* Cart Summary */}
      <div className="max-w-3xl mx-auto bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
        <h2 className="text-2xl font-bold mb-3">Order Summary</h2>
        {cart.items.map((item) => (
          <div
            key={item.dish._id}
            className="flex justify-between bg-gray-800 p-3 rounded-lg"
          >
            <span>{item.dish.name} x {item.quantity}</span>
            <span>${item.dish.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between text-xl font-bold neon-text mt-4">
          <span>Total</span>
          <span>${cart.totalPrice}</span>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="max-w-3xl mx-auto mt-6">
        <label className="block mb-2 font-semibold neon-text">Delivery Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-500"
          rows={4}
          placeholder="Enter your delivery address"
        />
      </div>

      {/* Payment Method */}
      <div className="max-w-3xl mx-auto mt-6">
        <h2 className="text-xl font-bold neon-text mb-2">Payment Method</h2>
        <div className="flex gap-4">
          <label className="flex-1 p-4 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:border-green-500">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
              className="mr-2"
            />
            Cash on Delivery
          </label>

          <label className="flex-1 p-4 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:border-green-500">
            <input
              type="radio"
              name="payment"
              value="razorpay"
              checked={paymentMethod === "razorpay"}
              onChange={() => setPaymentMethod("razorpay")}
              className="mr-2"
            />
            Pay Online (Razorpay)
          </label>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="max-w-3xl mx-auto mt-6 flex justify-end">
        <button
          onClick={handlePlaceOrder}
          className="px-8 py-4 bg-green-500 text-black font-bold rounded-lg hover:bg-green-600 transition-all"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;


