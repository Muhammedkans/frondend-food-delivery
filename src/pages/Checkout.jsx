import { useGetCartQuery } from "../redux/api/customerApi";
import { usePlaceOrderMutation } from "../redux/api/orderApi";
import { useCreatePaymentOrderMutation } from "../redux/api/paymentApi";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Checkout = () => {
  const { data: cartData, isLoading } = useGetCartQuery();
  const [placeOrder] = usePlaceOrderMutation();
  const [createPaymentOrder] = useCreatePaymentOrderMutation();

  const [address, setAddress] = useState("");
  const [loadingPayment, setLoadingPayment] = useState(false);

  const cart = cartData?.cart;
  const total = cart?.totalPrice || 0;

  useEffect(() => {
    if (cart?.address) setAddress(cart.address);
  }, [cart]);

  if (isLoading)
    return <div className="text-center text-[#00ff9d] mt-10 text-xl">Loading checkout…</div>;

  if (!cart || cart.items.length === 0)
    return (
      <div className="text-center text-gray-400 mt-12 text-xl">
        Your cart is empty 🛒
      </div>
    );

  // ✅ Razorpay script loader
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ✅ Handle Payment
  const handlePayment = async () => {
    setLoadingPayment(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Failed to load Razorpay");
      setLoadingPayment(false);
      return;
    }

    try {
      // ✅ Step 1: Create Razorpay Order
      const paymentRes = await createPaymentOrder({
        amount: total,
      }).unwrap();

      const razorOrder = paymentRes.order;

      // ✅ Step 2: Place order temporarily
      const orderRes = await placeOrder({
        address,
      }).unwrap();

      const orderId = orderRes.order._id;

      // ✅ Step 3: Razorpay Payment UI
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorOrder.amount,
        currency: "INR",
        name: "Food Delivery",
        description: "Order Payment",
        order_id: razorOrder.id,

        handler: async function (response) {
          // ✅ Payment success → verify backend
          const data = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId,
          };

          await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              credentials: "include",
            },
            body: JSON.stringify(data),
          });

          alert("✅ Payment successful!");
        },

        prefill: {
          name: "Customer",
          email: "customer@email.com",
        },

        theme: {
          color: "#00ff9d",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.log(error);
      alert("Payment failed");
    }

    setLoadingPayment(false);
  };

  return (
    <div className="pb-20">
      <h1 className="text-3xl font-bold neon-green mb-6">Checkout</h1>

      {/* ✅ Address Section */}
      <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(0,255,157,0.1)]">
        <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          className="w-full bg-white/10 p-3 rounded-xl outline-none text-white"
          placeholder="Enter your address"
        ></textarea>
      </div>

      {/* ✅ Order Summary */}
      <div className="mt-8 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(0,255,157,0.1)]">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        {cart.items.map((item) => (
          <div
            key={item.dish}
            className="flex justify-between mb-3 text-gray-300"
          >
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₹ {item.price * item.quantity}</span>
          </div>
        ))}

        <div className="flex justify-between text-[#00ff9d] text-xl font-bold mt-4">
          <span>Total</span>
          <span>₹ {total}</span>
        </div>
      </div>

      {/* ✅ PAY NOW BUTTON */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handlePayment}
        disabled={loadingPayment}
        className="w-full mt-8 py-4 bg-[#00ff9d] text-black text-lg font-semibold rounded-xl hover:bg-[#00ffbb] transition shadow-[0_0_20px_#00ff9d] disabled:opacity-50"
      >
        {loadingPayment ? "Processing..." : "Pay Now"}
      </motion.button>
    </div>
  );
};

export default Checkout;










