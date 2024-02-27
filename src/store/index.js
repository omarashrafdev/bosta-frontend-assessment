import { configureStore } from "@reduxjs/toolkit";
import LngReducer from "./LngReducer";
const store = configureStore({
  reducer: {
    lang: LngReducer,
  },
});

export default store;
