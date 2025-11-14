// src/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

/*
  🚀 CLEANEST POSSIBLE APPROACH
  --------------------------------
  You are using React Query for API calls.
  That means Redux should store ONLY the final state:
  - user
  - token (if needed)
  - minimal loading/error (only for UI consistency)
*/

const initialState = {
  user: null,        // Logged-in user object
  token: null,       // JWT token (optional since cookie is used)
  loading: false,    // For UI loaders
  error: null,       // For UI errors
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // -----------------------------------------------------------
    // ✅ Set user after successful LOGIN or REGISTER
    // -----------------------------------------------------------
    setUser(state, action) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token || null;
      state.error = null;
      state.loading = false;
    },

    // -----------------------------------------------------------
    // ✅ Manual loader control (for premium UI smoothness)
    // -----------------------------------------------------------
    setLoading(state, action) {
      state.loading = action.payload;
    },

    // -----------------------------------------------------------
    // ❌ Clear user on logout
    // -----------------------------------------------------------
    logoutUser(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },

    // -----------------------------------------------------------
    // ⚠️ Set error message
    // -----------------------------------------------------------
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Export Actions
export const { setUser, logoutUser, setLoading, setError } = userSlice.actions;

// Export Reducer
export default userSlice.reducer;




