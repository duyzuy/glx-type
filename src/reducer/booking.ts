import { BookingType } from "../models";

import { createReducer } from "@reduxjs/toolkit";
import {
  onSelectPaymentMethod,
  setChannelAndMethod,
  onSelectCombo,
  onSelectCinema,
  onResetComboSelect,
  onResetPaymentData,
} from "../pages/checkout/actions";

const initialState: BookingType = {
  chanelAndMethod: {
    chanel: {},
    method: {},
  },
  voucherType: {},
  comboItem: {},
  offer: {},
  paymentData: {},
};

const bookingReducer = createReducer(initialState, (builder) => {
  builder.addCase(onSelectCinema, (state, action) => {
    return {
      ...state,
      voucherType: {
        ...action.payload,
      },
    };
  });
  builder.addCase(onSelectCombo.fulfilled, (state, action) => {
    return {
      ...state,
      comboItem: {
        ...action.payload.comboItem,
      },
      offer: {
        ...action.payload.offer,
      },
    };
  });
  builder.addCase(onSelectPaymentMethod.fulfilled, (state, action) => {
    return {
      ...state,
      paymentData: {
        ...action.payload.syncData,
      },
    };
  });
  builder.addCase(setChannelAndMethod, (state, action) => {
    return {
      ...state,
      chanelAndMethod: {
        chanel: { ...action.payload.channel },
        method: { ...action.payload.method },
      },
    };
  });
  builder.addCase(onResetComboSelect, (state, action) => {
    return {
      ...state,
      comboItem: action.payload.comboItem,
      offer: action.payload.offer,
    };
  });
  builder.addCase(onResetPaymentData, (state, action) => {
    return {
      ...state,
      paymentData: {},
    };
  });
});
export default bookingReducer;
