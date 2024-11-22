import { createSlice } from '@reduxjs/toolkit';

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    id: localStorage.getItem('UserId') || null, // Load from localStorage on initialization
    Admintoken: null,
    UserToken: null,
  },
  reducers: {
    setUserId: (state, action) => {
      state.id = action.payload; 
      localStorage.setItem('UserId', action.payload); // Save to localStorage
    },
    clearUserId: (state) => {
      state.id = null; // Clear user ID
    },
    setToken: (state, action) => {
      state.Admintoken = action.payload;
    },
    setUserToken: (state, action) => {
      state.UserToken = action.payload
    }
  },
});

// Correctly export the reducers as actions
export const { setUserId, clearUserId, setToken, setUserToken } = profileSlice.actions;

export default profileSlice.reducer;
