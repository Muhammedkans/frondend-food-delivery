import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],          // ✅ All cart items
    totalQty: 0,        // ✅ Total items count
    totalPrice: 0,      // ✅ Auto-calculated total price
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // ✅ Start loading
        startLoading: (state) => {
            state.loading = true;
            state.error = null;
        },

        // ✅ Set full cart (from backend /customer/cart)
        setCart: (state, action) => {
            state.items = action.payload.items || [];
            state.totalQty = action.payload.totalQty || 0;
            state.totalPrice = action.payload.totalPrice || 0;
            state.loading = false;
            state.error = null;
        },

        // ✅ Add item to cart
        addItem: (state, action) => {
            const newItem = action.payload;

            // check if already exists
            const existing = state.items.find(item => item.dishId === newItem.dishId);

            if (existing) {
                existing.quantity += newItem.quantity;
            } else {
                state.items.push(newItem);
            }

            state.totalQty += newItem.quantity;
            state.totalPrice += newItem.price * newItem.quantity;
        },

        // ✅ Increase quantity
        increaseQty: (state, action) => {
            const id = action.payload;
            const item = state.items.find(i => i.dishId === id);

            if (item) {
                item.quantity += 1;
                state.totalQty += 1;
                state.totalPrice += item.price;
            }
        },

        // ✅ Decrease quantity
        decreaseQty: (state, action) => {
            const id = action.payload;
            const item = state.items.find(i => i.dishId === id);

            if (item && item.quantity > 1) {
                item.quantity -= 1;
                state.totalQty -= 1;
                state.totalPrice -= item.price;
            }
        },

        // ✅ Remove item completely
        removeItem: (state, action) => {
            const id = action.payload;
            const item = state.items.find(i => i.dishId === id);

            if (item) {
                state.totalQty -= item.quantity;
                state.totalPrice -= item.quantity * item.price;

                state.items = state.items.filter(i => i.dishId !== id);
            }
        },

        // ✅ Clear complete cart
        clearCart: (state) => {
            state.items = [];
            state.totalQty = 0;
            state.totalPrice = 0;
        },

        // ✅ Error
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const {
    startLoading,
    setCart,
    addItem,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
    setError,
} = cartSlice.actions;

export default cartSlice.reducer;

