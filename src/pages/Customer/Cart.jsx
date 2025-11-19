import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import customerApi from "../../api/customerApi";

const TIP_OPTIONS = [0, 20, 40, 60, 100];

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTip, setSelectedTip] = useState(0);
  const navigate = useNavigate();

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

  const updateQuantity = async (dishId, quantity) => {
    try {
      const res = await customerApi.updateCartItem({ dishId, quantity });
      setCart(res.data.cart);
    } catch (err) {
      toast.error("Error updating cart");
    }
  };

  const increaseQty = (item) =>
    updateQuantity(item.dish._id, item.quantity + 1);

  const decreaseQty = (item) =>
    item.quantity === 1
      ? removeItem(item.dish._id)
      : updateQuantity(item.dish._id, item.quantity - 1);

  const removeItem = async (dishId) => {
    try {
      const res = await customerApi.removeFromCart(dishId);
      setCart(res.data.cart);
      toast.success("Item removed");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      await customerApi.clearCart();
      await fetchCart();
      toast.success("Cart cleared");
    } catch (err) {
      toast.error("Failed to clear cart");
    }
  };

  const subtotal = useMemo(
    () =>
      cart?.items?.reduce(
        (acc, item) => acc + item.dish.price * item.quantity,
        0
      ) || 0,
    [cart]
  );

  const packagingFee = subtotal ? 12 : 0;
  const platformFee = subtotal
    ? Number(Math.max(subtotal * 0.02, 5).toFixed(2))
    : 0;
  const deliveryFee = subtotal >= 499 ? 0 : subtotal ? 29 : 0;
  const loyaltyProgress = Math.min((subtotal / 800) * 100, 100);
  const totalPayable =
    subtotal + packagingFee + platformFee + deliveryFee + selectedTip;

  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        charges: {
          platformFee,
          packagingFee,
          deliveryFee,
          tip: selectedTip,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030711] text-white flex items-center justify-center text-xl text-emerald-300">
        Syncing your cart...
      </div>
    );
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="min-h-screen bg-[#030711] text-white flex flex-col items-center justify-center space-y-6">
        <h2 className="text-3xl font-bold text-white">
          Your cart wants some love
        </h2>
        <p className="text-gray-400 text-sm">
          Add dishes from the home feed to unlock Neon rewards.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-2xl bg-emerald-400 text-black font-semibold shadow-neon hover:bg-emerald-300 transition"
        >
          Discover restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030711] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
              Neon cart
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-white">
              Ready to dispatch
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Add a tip or coupon to unlock more rewards.
            </p>
          </div>
          <div className="w-full lg:w-auto">
            <div className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-2">
              Loyalty progress
            </div>
            <div className="w-full lg:w-64 bg-white/5 rounded-full h-3 overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-lime-400"
                style={{ width: `${loyaltyProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {loyaltyProgress >= 100
                ? "You unlocked Neon Booster for this drop."
                : `₹${Math.max(800 - subtotal, 0).toFixed(
                    0
                  )} away from Neon Booster perks.`}
            </p>
          </div>
        </header>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
          <section className="space-y-5">
            {cart.items.map((item) => (
              <CartItemCard
                key={item.dish._id}
                item={item}
                increaseQty={() => increaseQty(item)}
                decreaseQty={() => decreaseQty(item)}
                removeItem={() => removeItem(item.dish._id)}
              />
            ))}
            <UpsellBanner />
          </section>

          <aside className="space-y-5">
            <SummaryCard
              subtotal={subtotal}
              packagingFee={packagingFee}
              platformFee={platformFee}
              deliveryFee={deliveryFee}
              tip={selectedTip}
              total={totalPayable}
              goToCheckout={handleCheckout}
              clearCart={clearCart}
            />
            <TipSelector
              selectedTip={selectedTip}
              onSelect={setSelectedTip}
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

const CartItemCard = ({ item, increaseQty, decreaseQty, removeItem }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="rounded-3xl border border-white/10 bg-white/5 p-4 flex gap-4 items-center"
  >
    <img
      src={item.dish.imageUrl || item.dish.image || "/logo.png"}
      alt={item.dish.name}
      className="w-24 h-24 rounded-2xl object-cover"
    />
    <div className="flex-1 space-y-1">
      <h3 className="text-lg font-semibold text-white">{item.dish.name}</h3>
      <p className="text-sm text-gray-400">{item.dish.description}</p>
      <p className="text-sm text-gray-400">
        ₹{item.dish.price} • {item.dish.category || "Chef special"}
      </p>
      <button
        onClick={removeItem}
        className="text-xs text-red-300 hover:text-red-200"
      >
        Remove
      </button>
    </div>
    <div className="flex flex-col items-end gap-3">
      <p className="text-xl font-semibold text-emerald-300">
        ₹{item.dish.price * item.quantity}
      </p>
      <div className="flex items-center gap-3 bg-white/5 rounded-full px-3 py-1">
        <button
          onClick={decreaseQty}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
        >
          -
        </button>
        <span className="text-sm font-semibold">{item.quantity}</span>
        <button
          onClick={increaseQty}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200 hover:bg-emerald-400/30"
        >
          +
        </button>
      </div>
    </div>
  </motion.div>
);

const UpsellBanner = () => (
  <div className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-4 flex flex-col gap-2">
    <p className="text-xs uppercase tracking-[0.4em] text-amber-200">
      Boost rewards
    </p>
    <p className="text-amber-50 text-sm">
      Add a dessert or beverage to unlock +₹120 Neon rewards on this order.
    </p>
    <p className="text-xs text-amber-200/70">Auto-applies at checkout.</p>
  </div>
);

const SummaryCard = ({
  subtotal,
  packagingFee,
  platformFee,
  deliveryFee,
  tip,
  total,
  goToCheckout,
  clearCart,
}) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-4">
    <div>
      <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
        Fare breakdown
      </p>
      <div className="flex items-center justify-between text-sm text-gray-400 mt-4">
        <span>Subtotal</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Packaging</span>
        <span>₹{packagingFee.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Platform fee</span>
        <span>₹{platformFee.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Delivery</span>
        <span>{deliveryFee ? `₹${deliveryFee.toFixed(2)}` : "Free"}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Tip</span>
        <span>₹{tip.toFixed(2)}</span>
      </div>
    </div>
    <div className="flex items-center justify-between text-lg font-bold text-white border-t border-white/10 pt-3">
      <span>Total due</span>
      <span>₹{total.toFixed(2)}</span>
    </div>
    <div className="flex flex-col gap-3">
      <button
        onClick={goToCheckout}
        className="w-full py-3 rounded-2xl bg-emerald-400 text-black font-semibold shadow-neon hover:bg-emerald-300 transition"
      >
        Proceed to checkout
      </button>
      <button
        onClick={clearCart}
        className="w-full py-3 rounded-2xl border border-white/10 text-sm text-gray-300 hover:border-white/30 transition"
      >
        Clear cart
      </button>
    </div>
  </div>
);

const TipSelector = ({ selectedTip, onSelect }) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
    <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
      Rider appreciation
    </p>
    <p className="text-sm text-gray-400 mt-2">
      100% of this goes to your delivery partner. Higher tips unlock priority
      dispatch.
    </p>
    <div className="flex flex-wrap gap-2 mt-4">
      {TIP_OPTIONS.map((tip) => (
        <button
          key={tip}
          onClick={() => onSelect(tip)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
            selectedTip === tip
              ? "bg-emerald-400 text-black border-emerald-300"
              : "bg-white/5 text-gray-300 border-white/10 hover:border-white/30"
          }`}
        >
          {tip === 0 ? "No tip" : `₹${tip}`}
        </button>
      ))}
    </div>
  </div>
);

export default Cart;


