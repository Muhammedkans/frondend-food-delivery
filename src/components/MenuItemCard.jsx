// src/components/MenuItemCard.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { motion } from 'framer-motion';

const MenuItemCard = ({ menuItem }) => {
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);

  const image =
    menuItem.image ||
    `https://source.unsplash.com/600x400/?${encodeURIComponent(menuItem.name || 'food')}`;

  const onAdd = () => {
    dispatch(
      addToCart({
        menuItemId: menuItem._id,
        restaurantId: menuItem.restaurantId || menuItem.restaurant || null,
        name: menuItem.name,
        price: menuItem.price,
        quantity: qty,
      })
    );
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="w-64 bg-white rounded-3xl shadow-lg p-5 flex-shrink-0 cursor-pointer hover:shadow-2xl transition-all"
    >
      <div className="relative">
        <img
          src={image}
          alt={menuItem.name}
          className="w-full h-40 object-cover rounded-2xl mb-4"
        />
        {menuItem.isPopular && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            Popular
          </div>
        )}
      </div>

      <h4 className="font-bold text-gray-900 text-lg truncate">{menuItem.name}</h4>
      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{menuItem.description}</p>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xl font-bold text-indigo-600">₹{menuItem.price}</div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            className="w-14 text-center border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={onAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-xl font-semibold transition-all"
          >
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItemCard;





