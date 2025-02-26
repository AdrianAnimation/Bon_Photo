import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import photosReducer from "./slices/photosSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    photos: photosReducer,
  },
});
