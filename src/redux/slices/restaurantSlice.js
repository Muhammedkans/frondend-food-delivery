// src/redux/slices/restaurantSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

// ======================
// Initial State
// ======================
const initialState = {
  restaurants: [],   // List of all restaurants
  loading: false,    // Loading state for async operations
  error: null,       // Error messages
};

// ======================
// Async Thunks
// ======================

// Fetch all restaurants
export const fetchRestaurants = createAsyncThunk(
  'restaurant/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/restaurants', { withCredentials: true });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch restaurants');
    }
  }
);

// Add a new restaurant (admin or restaurant owner)
export const addRestaurant = createAsyncThunk(
  'restaurant/add',
  async (restaurantData, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/restaurants', restaurantData, { withCredentials: true });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add restaurant');
    }
  }
);

// ======================
// Slice
// ======================
const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    // Clear all restaurants and reset error
    clearRestaurants: (state) => {
      state.restaurants = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Restaurants
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Restaurant
      .addCase(addRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants.push(action.payload);
      })
      .addCase(addRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ======================
// Exports
// ======================
export const { clearRestaurants } = restaurantSlice.actions;
export default restaurantSlice.reducer;


