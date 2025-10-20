// src/redux/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

// ======================
// Initial State
// ======================
const initialState = {
  cartItems: localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : [],
};

// ======================
// Slice
// ======================
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find(i => i.menuItemId === item.menuItemId);

      if (existItem) {
        // If item exists, increment quantity
        existItem.quantity += item.quantity > 0 ? item.quantity : 1;
      } else {
        // Else, add new item
        state.cartItems.push({
          ...item,
          quantity: item.quantity > 0 ? item.quantity : 1,
        });
      }

      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    },

    // Remove item from cart
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        i => i.menuItemId !== action.payload
      );
      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    },

    // Clear entire cart
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cart');
    },

    // Update item quantity
    updateCartItemQuantity: (state, action) => {
      const { menuItemId, quantity } = action.payload;
      const item = state.cartItems.find(i => i.menuItemId === menuItemId);

      if (item) {
        item.quantity = quantity > 0 ? quantity : 1;
      }

      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    },
  },
});

// ======================
// Exports
// ======================
export const { addToCart, removeFromCart, clearCart, updateCartItemQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;


