import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,         // stores logged-in user info
    isAuthenticated: false,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // ✅ Start loading
        startLoading: (state) => {
            state.loading = true;
            state.error = null;
        },

        // ✅ User login/register success
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
        },

        // ✅ Logout user
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },

        // ✅ Set error
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        // ✅ Clear error
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const { startLoading, setUser, logout, setError, clearError } = userSlice.actions;
export default userSlice.reducer;

