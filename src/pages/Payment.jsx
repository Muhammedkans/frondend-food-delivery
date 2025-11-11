import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ Axios config (cookies support)
axios.defaults.withCredentials = true;

export default function PaymentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [amount, setAmount] = useState(""); // custom for test mode

  // ✅ CALL BACKEND → CREATE Razorpay Order
  const startPayment = async () => {
    try {
      setLoading(true);

      // 1️⃣ Create Razorpay Order (backend)
      const orderRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/order`,
        { amount: amount || 500 } // default Rs.500 test
      );

      const { id: razorpayOrderId, amount: razorpayAmount } =
        orderRes.data.order;

      // 2️⃣ Load Razorpay script dynamically
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: razorpayAmount,
          currency: "INR",
          name: "Food Delivery App",
          description: "Order Payment",
          order_id: razorpayOrderId,

          theme: {
            color: "#00ff9d", // neon green
          },

          // 3️⃣ Payment Success Handler
          handler: async function (response) {
            try {
              const verifyRes = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/payment/verify`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: localStorage.getItem("ORDER_ID"), // set from checkout
                }
              );

              if (verifyRes.data.success) {
                navigate("/order-success");
              }
            } catch (err) {
              alert("Verification failed!");
            }
          },

          // 4️⃣ Payment Failure
          modal: {
            ondismiss: function () {
              alert("Payment cancelled");
            },
          },

          prefill: {
            name: "Customer",
            email: "customer@example.com",
            contact: "9999999999",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      };

      document.body.appendChild(script);
    } catch (error) {
      console.log(error);
      alert("Payment error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex justify-center items-center p-6">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-xl shadow-green-500/10">
        
        <h1 className="text-3xl font-bold text-center mb-6 text-neon-green">
          Secure Payment
        </h1>

        {/* Amount input for testing */}
        <div className="mb-5">
          <label className="block text-gray-300 mb-2">Amount (₹)</label>
          <input
            type="number"
            placeholder="Enter amount"
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:border-green-400"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* PAY BUTTON */}
        <button
          onClick={startPayment}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-lg font-semibold transition-all duration-300 bg-neon-green text-black ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-neon-green/80"
          }`}
        >
          {loading ? "Processing…" : "Pay Now"}
        </button>

        {/* Extra note */}
        <p className="text-center text-gray-400 mt-4 text-sm">
          All payments are encrypted and secure.
        </p>
      </div>
    </div>
  );
}
