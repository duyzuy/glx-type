import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../reducer/user";
import chanelReducer from "../pages/chanel/chanelSlice";

const reducer = { chanel: chanelReducer, userInfo: userReducer };

const store = configureStore({
  reducer,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
