import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "../reducer/user";
import chanelReducer from "../pages/chanel/chanelSlice";
import checkoutReducer from "../pages/checkout/checkoutSlice";
import bookingReducer from "../reducer/booking";
import type { BrowserHistory } from "@remix-run/router";

export const createRootReducer = (history: BrowserHistory) =>
  combineReducers({
    chanel: chanelReducer,
    userInfo: userReducer,
    checkout: checkoutReducer,
    booking: bookingReducer,
  });
