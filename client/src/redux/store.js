import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './ProfileSlice';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    profile: profileReducer, // Use the reducer directly without persistence
  },
});
