import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

export default function OrderSuccess() {
  const navigate = useNavigate();

  // ✅ Confetti burst (on load)
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    // ✅ Small random confetti drops
    const interval = setInterval(() => {
      confetti({
        particleCount: 20,
        spread: 60,
        origin: { y: Math.random() - 0.2 }
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#06060a] text-white p-6">
      
      {/* ✅ Animated green ring */}
      <div className="relative mb-8">
        <div className="w-36 h-36 rounded-full bg-neon-green/10 backdrop-blur-xl border border-neon-green shadow-lg shadow-neon-green/40 animate-pulse flex justify-center items-center">
          ✅
        </div>

        {/* Glow shadow */}
        <div className="absolute inset-0 blur-3xl bg-neon-green/20 -z-10"></div>
      </div>

      <h1 className="text-4xl font-extrabold text-neon-green mb-4 text-center">
        Order Placed Successfully!
      </h1>

      <p className="text-gray-300 text-lg text-center max-w-md">
        Thank you for your order.  
        Our delivery partner will reach you soon!
      </p>

      {/* ✅ Buttons */}
      <div className="mt-10 flex gap-4">
        <button
          onClick={() => navigate("/orders")}
          className="px-8 py-3 rounded-xl bg-neon-green text-black text-lg font-semibold hover:bg-neon-green/80 transition-all"
        >
          Track Order
        </button>

        <button
          onClick={() => navigate("/")}
          className="px-8 py-3 rounded-xl bg-white/10 border border-white/20 text-lg hover:bg-white/20 transition-all"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
