import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentOrder: null,      // ✅ order placed (before payment)
    myOrders: [],            // ✅ list of customer orders
    activeOrder: null,       // ✅ current running order (for tracking)
    loading: false,
    error: null,
    paymentStatus: null,     // ✅ "success" | "failed" | null
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        startLoading: (state) => {
            state.loading = true;
            state.error = null;
        },

        // ✅ Set order after placing
        setCurrentOrder: (state, action) => {
            state.currentOrder = action.payload;
            state.loading = false;
        },

        // ✅ Save payment result
        setPaymentStatus: (state, action) => {
            state.paymentStatus = action.payload; // success / failed
            state.loading = false;
        },

        // ✅ Fetch all my orders
        setMyOrders: (state, action) => {
            state.myOrders = action.payload;
            state.loading = false;
        },

        // ✅ Active order (tracking page)
        setActiveOrder: (state, action) => {
            state.activeOrder = action.payload;
            state.loading = false;
        },

        // ✅ Update status (delivered, picked_up)
        updateOrderStatus: (state, action) => {
            if (state.activeOrder) {
                state.activeOrder.status = action.payload;
            }
        },

        // ✅ When user completes order, clear current order
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
            state.paymentStatus = null;
        },

        // ✅ Error handle
        setOrderError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const {
    startLoading,
    setCurrentOrder,
    setPaymentStatus,
    setMyOrders,
    setActiveOrder,
    updateOrderStatus,
    clearCurrentOrder,
    setOrderError,
} = orderSlice.actions;

export default orderSlice.reducer;
