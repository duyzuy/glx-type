import { BookingType } from "../models";

import { createReducer } from "@reduxjs/toolkit";
import {
  fetchPaymentChannelData,
  setChannelAndMethod,
  onSelectCombo,
  onSelectCinema,
  onResetComboSelect,
  onResetPaymentData,
} from "../pages/checkout/actions";

const initialState: BookingType = {
  channelAndMethod: {
    channel: {},
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
  builder.addCase(fetchPaymentChannelData.fulfilled, (state, action) => {
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
      channelAndMethod: {
        channel: { ...action.payload.channel },
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
      channelAndMethod: {
        channel: {},
        method: {},
      },
    };
  });
});
export default bookingReducer;
