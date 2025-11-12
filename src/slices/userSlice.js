// src/slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Async login action (Professional approach)
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        credentials,
        { withCredentials: true } // so cookies (token) are stored properly
      );
      return response.data; // expected { user, token }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// ✅ Initial State
const initialState = {
  user: null,        // logged-in user info
  token: null,       // auth token
  loading: false,    // loading indicator
  error: null,       // error message
};

// ✅ Slice Definition
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ✅ Set user data (used manually if needed)
    setUser(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },

    // ✅ Logout or clear user
    logoutUser(state) {
      state.user = null;
      state.token = null;
      state.error = null;
    },

    // ✅ Manual loading/error management (optional)
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },

  // ✅ Handle async loginUser states
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Invalid credentials";
      });
  },
});

// ✅ Export Actions
export const { setUser, logoutUser, setLoading, setError } = userSlice.actions;

// ✅ Default Export
export default userSlice.reducer;



