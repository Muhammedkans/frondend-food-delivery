// src/slices/orderSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],          // All user orders
  currentOrder: null,  // Order being placed or viewed
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // ---------------------------
    // Place a new order
    // ---------------------------
    placeOrderStart(state) {
      state.loading = true;
      state.error = null;
    },
    placeOrderSuccess(state, action) {
      state.loading = false;
      state.orders.push(action.payload);
      state.currentOrder = action.payload;
    },
    placeOrderFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ---------------------------
    // Fetch all orders of user
    // ---------------------------
    fetchOrdersStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess(state, action) {
      state.loading = false;
      state.orders = action.payload;
    },
    fetchOrdersFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ---------------------------
    // Set / update current order
    // ---------------------------
    setCurrentOrder(state, action) {
      state.currentOrder = action.payload;
    },

    // ---------------------------
    // Clear current order (after payment / cancel)
    // ---------------------------
    clearCurrentOrder(state) {
      state.currentOrder = null;
    },
  },
});

export const {
  placeOrderStart,
  placeOrderSuccess,
  placeOrderFail,
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFail,
  setCurrentOrder,
  clearCurrentOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
