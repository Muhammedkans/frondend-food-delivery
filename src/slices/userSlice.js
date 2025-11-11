// src/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,        // Stores logged-in user info
  token: null,       // Auth token from cookies
  loading: false,    // Loading state for async actions
  error: null,       // Error messages
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
      state.error = null;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading, setError } = userSlice.actions;

export default userSlice.reducer;


