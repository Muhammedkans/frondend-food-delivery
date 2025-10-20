// src/components/CartItem.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart, addToCart } from '../redux/slices/cartSlice';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeFromCart(item.menuItemId));
  };

  const handleQuantityChange = (e) => {
    const newQuantity = Number(e.target.value);
    if (newQuantity <= 0) return;
    const diff = newQuantity - item.quantity;
    dispatch(addToCart({ ...item, quantity: diff }));
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex flex-col md:flex-row items-center justify-between bg-white shadow-lg rounded-2xl p-4 mb-4 hover:shadow-2xl transition-all"
    >
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
        <p className="text-gray-500 mt-1">₹{item.price}</p>
      </div>

      <div className="flex items-center space-x-2 mt-3 md:mt-0">
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={handleQuantityChange}
          className="w-16 border rounded-lg px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleRemove}
          className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
        >
          <Trash2 size={16} />
          Remove
        </button>
      </div>

      <div className="font-bold text-gray-900 mt-3 md:mt-0 text-lg">
        ₹{item.price * item.quantity}
      </div>
    </motion.div>
  );
};

export default CartItem;


