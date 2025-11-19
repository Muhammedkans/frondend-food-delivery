import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import customerApi from "../../api/customerApi";
import paymentApi from "../../api/paymentApi";

const TIP_OPTIONS = [0, 20, 40, 60, 100];

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [selectedTip, setSelectedTip] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const presetCharges = location.state?.charges;

  useEffect(() => {
    if (presetCharges?.tip !== undefined) {
      setSelectedTip(presetCharges.tip);
    }
  }, [presetCharges?.tip]);

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

  const subtotal = useMemo(
    () =>
      cart?.items?.reduce(
        (acc, item) => acc + item.dish.price * item.quantity,
        0
      ) || 0,
    [cart]
  );

  const packagingFee = subtotal ? presetCharges?.packagingFee ?? 12 : 0;
  const platformFee = subtotal
    ? presetCharges?.platformFee ??
      Number(Math.max(subtotal * 0.02, 5).toFixed(2))
    : 0;
  const baseDeliveryFee =
    subtotal >= 499 ? 0 : presetCharges?.deliveryFee ?? (subtotal ? 29 : 0);

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === "NEON100") {
      if (subtotal < 500) {
        toast.error("Spend ₹500+ to unlock NEON100");
        return;
      }
      setCouponDiscount(100);
      setAppliedCoupon(code);
      toast.success("₹100 cashback applied");
    } else if (code === "FREESHIP") {
      if (baseDeliveryFee === 0) {
        toast.info("Delivery is already free");
        return;
      }
      setCouponDiscount(baseDeliveryFee);
      setAppliedCoupon(code);
      toast.success("Delivery fee waived");
    } else {
      toast.error("Coupon not recognized");
      return;
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const deliveryAfterCoupon =
    baseDeliveryFee - (appliedCoupon === "FREESHIP" ? couponDiscount : 0);

  const grandTotal = Math.max(
    subtotal +
      packagingFee +
      platformFee +
      deliveryAfterCoupon +
      selectedTip -
      (appliedCoupon === "NEON100" ? couponDiscount : 0),
    0
  );

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error("Please enter delivery address");
      return;
    }

    const chargesPayload = {
      platformFee,
      packagingFee,
      deliveryFee: deliveryAfterCoupon,
      couponDiscount: appliedCoupon ? couponDiscount : 0,
    };

    try {
      if (paymentMethod === "cod") {
        const res = await customerApi.placeOrder({
          address,
          note,
          paymentMethod,
          tip: selectedTip,
          coupon: appliedCoupon,
          charges: chargesPayload,
        });
        toast.success("Order placed successfully!");
        navigate(`/order-success/${res.data.order._id}`);
      } else {
        const res = await paymentApi.createOrder({
          amount: Math.round(grandTotal * 100),
        });
        const { orderId, key } = res.data;

        const options = {
          key,
          amount: Math.round(grandTotal * 100),
          currency: "INR",
          name: "Neon Eats",
          description: "Order Payment",
          order_id: orderId,
          handler: async (response) => {
            try {
              await paymentApi.verifyPayment(response);
              const orderRes = await customerApi.placeOrder({
                address,
                note,
                paymentMethod: "razorpay",
                tip: selectedTip,
                coupon: appliedCoupon,
                charges: chargesPayload,
              });
              toast.success("Order placed successfully!");
              navigate(`/order-success/${orderRes.data.order._id}`);
            } catch (err) {
              toast.error("Payment verification failed");
            }
          },
          theme: {
            color: "#34d399",
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
      <div className="min-h-screen bg-[#030711] text-white flex items-center justify-center text-xl text-emerald-300">
        Preparing checkout...
      </div>
    );
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="min-h-screen bg-[#030711] text-white flex flex-col items-center justify-center space-y-6">
        <h2 className="text-3xl font-bold text-white">Cart is empty</h2>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-2xl bg-emerald-400 text-black font-semibold shadow-neon hover:bg-emerald-300 transition"
        >
          Browse restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030711] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
            Checkout
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-white">
            Almost there ✦ confirm and enjoy
          </h1>
          <p className="text-sm text-gray-500">
            Secure payment, live tracking, loyalty boosters included.
          </p>
        </header>

        <div className="grid lg:grid-cols-[1.8fr_1fr] gap-8">
          <section className="space-y-6">
            <OrderSummary items={cart.items} />
            <AddressBlock
              address={address}
              setAddress={setAddress}
              note={note}
              setNote={setNote}
            />
            <PaymentSelector
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
            <TipChooser
              selectedTip={selectedTip}
              onSelect={setSelectedTip}
              label="Add a rider tip"
            />
            <CouponBox
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              applyCoupon={applyCoupon}
              appliedCoupon={appliedCoupon}
              removeCoupon={removeCoupon}
            />
          </section>

          <aside className="space-y-5">
            <FareCard
              subtotal={subtotal}
              packagingFee={packagingFee}
              platformFee={platformFee}
              deliveryFee={deliveryAfterCoupon}
              tip={selectedTip}
              couponDiscount={
                appliedCoupon === "NEON100" ? couponDiscount : 0
              }
              total={grandTotal}
            />
            <button
              onClick={handlePlaceOrder}
              className="w-full py-4 rounded-2xl bg-emerald-400 text-black font-semibold shadow-neon hover:bg-emerald-300 transition"
            >
              Place order · ₹{grandTotal.toFixed(2)}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

const OrderSummary = ({ items }) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-white">Order summary</h2>
      <p className="text-sm text-gray-400">{items.length} items</p>
    </div>
    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
      {items.map((item) => (
        <div
          key={item.dish._id}
          className="flex items-center justify-between text-sm text-gray-300 bg-white/5 p-3 rounded-2xl"
        >
          <span>
            {item.dish.name} <span className="text-gray-500">×</span>{" "}
            {item.quantity}
          </span>
          <span>₹{(item.dish.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
    </div>
  </div>
);

const AddressBlock = ({ address, setAddress, note, setNote }) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-4">
    <div>
      <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
        Delivery address
      </p>
      <textarea
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        rows={3}
        placeholder="Apartment, street, landmark"
        className="w-full mt-3 rounded-2xl bg-black/20 border border-white/10 p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-400"
      />
    </div>
    <div>
      <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
        Delivery notes
      </p>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Gate code, contactless instructions..."
        className="w-full mt-3 rounded-2xl bg-black/20 border border-white/10 p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-400"
      />
    </div>
  </div>
);

const PaymentSelector = ({ paymentMethod, setPaymentMethod }) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-4">
    <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
      Payment method
    </p>
    <div className="grid md:grid-cols-2 gap-3">
      <PaymentCard
        title="Cash on delivery"
        description="Pay rider when delivered"
        selected={paymentMethod === "cod"}
        onClick={() => setPaymentMethod("cod")}
      />
      <PaymentCard
        title="Razorpay"
        description="UPI / Cards / Netbanking"
        selected={paymentMethod === "razorpay"}
        onClick={() => setPaymentMethod("razorpay")}
      />
    </div>
  </div>
);

const PaymentCard = ({ title, description, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`text-left rounded-2xl border p-4 transition ${
      selected
        ? "border-emerald-400 bg-emerald-400/10 text-white"
        : "border-white/10 bg-black/20 text-gray-300 hover:border-white/30"
    }`}
  >
    <p className="font-semibold">{title}</p>
    <p className="text-xs text-gray-400 mt-1">{description}</p>
  </button>
);

const TipChooser = ({ selectedTip, onSelect, label }) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
    <p className="text-xs uppercase tracking-[0.4em] text-gray-500">{label}</p>
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

const CouponBox = ({
  couponCode,
  setCouponCode,
  applyCoupon,
  appliedCoupon,
  removeCoupon,
}) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-3">
    <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
      Coupons
    </p>
    <div className="flex gap-3">
      <input
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        placeholder="NEON100 / FREESHIP"
        className="flex-1 rounded-2xl bg-black/20 border border-white/10 p-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-400"
      />
      <button
        onClick={applyCoupon}
        className="px-5 py-3 rounded-2xl bg-white/10 text-sm font-semibold hover:bg-white/20 transition"
      >
        Apply
      </button>
    </div>
    {appliedCoupon && (
      <div className="flex items-center justify-between text-xs text-emerald-200 bg-emerald-400/10 border border-emerald-400/30 px-4 py-2 rounded-2xl">
        <span>Coupon {appliedCoupon} applied</span>
        <button onClick={removeCoupon} className="text-emerald-100">
          Remove
        </button>
      </div>
    )}
  </div>
);

const FareCard = ({
  subtotal,
  packagingFee,
  platformFee,
  deliveryFee,
  tip,
  couponDiscount,
  total,
}) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-3">
    <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
      Fare breakdown
    </p>
    <BreakdownRow label="Subtotal" value={subtotal} />
    <BreakdownRow label="Packaging" value={packagingFee} />
    <BreakdownRow label="Platform fee" value={platformFee} />
    <BreakdownRow label="Delivery" value={deliveryFee} />
    <BreakdownRow label="Tip" value={tip} />
    {couponDiscount > 0 && (
      <BreakdownRow label="Coupon savings" value={-couponDiscount} accent />
    )}
    <div className="flex items-center justify-between text-lg font-bold text-white border-t border-white/10 pt-3">
      <span>Total</span>
      <span>₹{total.toFixed(2)}</span>
    </div>
  </div>
);

const BreakdownRow = ({ label, value, accent }) => (
  <div className="flex items-center justify-between text-sm text-gray-400">
    <span>{label}</span>
    <span className={accent ? "text-emerald-300" : ""}>
      {value < 0 ? `-₹${Math.abs(value).toFixed(2)}` : `₹${value.toFixed(2)}`}
    </span>
  </div>
);

export default Checkout;

