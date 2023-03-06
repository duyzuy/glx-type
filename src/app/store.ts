import { configureStore } from "@reduxjs/toolkit";
import { createRootReducer } from "./rootReducer";
import { history } from "../utils/history";

const store = configureStore({
  reducer: createRootReducer(history),
  middleware: (getDefaultMiddleWare) => getDefaultMiddleWare(),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
