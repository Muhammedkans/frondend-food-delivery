// src/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],          // Array of cart items
  totalQuantity: 0,   // Total items in cart
  totalPrice: 0,      // Total price
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const existingItem = state.items.find(i => i._id === item._id);

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.items.push({ ...item, quantity: item.quantity });
      }

      state.totalQuantity += item.quantity;
      state.totalPrice += item.price * item.quantity;
    },

    removeFromCart(state, action) {
      const itemId = action.payload;
      const existingItem = state.items.find(i => i._id === itemId);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalPrice -= existingItem.price * existingItem.quantity;
        state.items = state.items.filter(i => i._id !== itemId);
      }
    },

    increaseQuantity(state, action) {
      const itemId = action.payload;
      const item = state.items.find(i => i._id === itemId);
      if (item) {
        item.quantity += 1;
        state.totalQuantity += 1;
        state.totalPrice += item.price;
      }
    },

    decreaseQuantity(state, action) {
      const itemId = action.payload;
      const item = state.items.find(i => i._id === itemId);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.totalQuantity -= 1;
        state.totalPrice -= item.price;
      } else if (item && item.quantity === 1) {
        // Remove item if quantity reaches 0
        state.items = state.items.filter(i => i._id !== itemId);
        state.totalQuantity -= 1;
        state.totalPrice -= item.price;
      }
    },

    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;


