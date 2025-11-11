import { configureStore } from "@reduxjs/toolkit";

// ✅ Import slices
import userReducer from "../slices/userSlice";
import cartReducer from "../slices/cartSlice";
import orderReducer from "../slices/orderSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
        order: orderReducer,
    },
});

export default store;

