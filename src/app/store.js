import { configureStore } from "@reduxjs/toolkit";
import homeSlice from "../features/homeSlice/homeSlice";

export const store = configureStore({
  reducer: {
    home: homeSlice,
  },
});
