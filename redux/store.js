import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/uiSlice.js";
import dashboardReducer from "./slices/dashboardSlice.js";
import productsReducer from "./slices/productsSlice.js";
import uploadHistoryReducer from "./slices/uploadHistorySlice.js";
import statsReducer from "./slices/statsSlice.js";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    dashboard: dashboardReducer,
    products: productsReducer,
    uploadHistory: uploadHistoryReducer,
    stats: statsReducer,
  },
});
