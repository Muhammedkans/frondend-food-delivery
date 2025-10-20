// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';

// Import your slices
import cartReducer from './slices/cartSlice';
import ordersReducer from './slices/ordersSlice';
import restaurantReducer from './slices/restaurantSlice';
import userReducer from './slices/userSlice';

// Create the store
const store = configureStore({
  reducer: {
    cart: cartReducer,
    orders: ordersReducer,
    restaurants: restaurantReducer,
    user: userReducer,
  },
});

export default store;

