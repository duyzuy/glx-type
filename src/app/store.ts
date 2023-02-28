import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../reducer/user";
import chanelReducer from "../pages/chanel/chanelSlice";
import checkoutReducer from "../pages/checkout/checkoutSlice";
import bookingReducer from "../reducer/booking";
const reducer = {
  chanel: chanelReducer,
  userInfo: userReducer,
  checkout: checkoutReducer,
  booking: bookingReducer,
};

const store = configureStore({
  reducer,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
