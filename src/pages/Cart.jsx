import {
  useGetCartQuery,
  useUpdateCartMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} from "../redux/api/customerApi";
import { motion } from "framer-motion";

const Cart = () => {
  const { data, isLoading, isError } = useGetCartQuery();
  const [updateCart] = useUpdateCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();

  if (isLoading)
    return (
      <div className="text-center text-xl text-[#00ff9d]">
        Loading cart...
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-red-400 text-xl">
        Failed to load cart
      </div>
    );

  const items = data?.cart?.items || [];
  const totalPrice = data?.cart?.totalPrice || 0;

  const handleUpdate = async (dishId, newQty) => {
    if (newQty < 1) return;

    try {
      await updateCart({
        dishId,
        quantity: newQty,
      }).unwrap();
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  const handleRemove = async (dishId) => {
    try {
      await removeFromCart(dishId).unwrap();
    } catch (err) {
      console.log("Remove error:", err);
    }
  };

  const handleClear = async () => {
    if (!confirm("Clear entire cart?")) return;

    try {
      await clearCart().unwrap();
    } catch (err) {
      console.log("Clear error:", err);
    }
  };

  return (
    <div>
      {/* ✅ PAGE TITLE */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold neon-green">Your Cart</h1>

        {items.length > 0 && (
          <button
            onClick={handleClear}
            className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Clear Cart
          </button>
        )}
      </div>

      {/* ✅ EMPTY CART */}
      {items.length === 0 && (
        <div className="text-center text-gray-400 mt-12 text-xl">
          Your cart is empty 🛒
        </div>
      )}

      {/* ✅ CART ITEMS */}
      <div className="grid grid-cols-1 gap-6">
        {items.map((item) => (
          <motion.div
            key={item.dish}
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4 shadow-[0_0_20px_rgba(0,255,157,0.1)]"
          >
            {/* ✅ Dish Image */}
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 rounded-xl object-cover"
            />

            {/* ✅ Dish Info */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-[#00ff9d] font-bold mt-1">₹ {item.price}</p>

              {/* ✅ QUANTITY BUTTONS */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => handleUpdate(item.dish, item.quantity - 1)}
                  className="w-8 h-8 bg-white/10 rounded-lg text-lg hover:bg-white/20"
                >
                  -
                </button>

                <span className="text-lg">{item.quantity}</span>

                <button
                  onClick={() => handleUpdate(item.dish, item.quantity + 1)}
                  className="w-8 h-8 bg-white/10 rounded-lg text-lg hover:bg-white/20"
                >
                  +
                </button>

                {/* ✅ REMOVE BUTTON */}
                <button
                  onClick={() => handleRemove(item.dish)}
                  className="ml-4 px-3 py-1 bg-red-600 rounded-lg text-sm hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ✅ PRICE SUMMARY */}
      {items.length > 0 && (
        <div className="mt-10 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(0,255,157,0.1)]">
          <h2 className="text-2xl font-bold mb-4">Bill Summary</h2>

          <div className="flex justify-between text-gray-300 text-lg mb-2">
            <span>Subtotal</span>
            <span>₹ {totalPrice}</span>
          </div>

          <div className="flex justify-between text-[#00ff9d] font-bold text-xl mt-4">
            <span>Total</span>
            <span>₹ {totalPrice}</span>
          </div>

          {/* ✅ CHECKOUT BUTTON */}
          <button
            onClick={() => alert("Checkout page coming next ✅")}
            className="w-full mt-6 py-3 bg-[#00ff9d] text-black text-lg font-semibold rounded-xl hover:bg-[#00ffbb] transition shadow-[0_0_20px_#00ff9d]"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;








