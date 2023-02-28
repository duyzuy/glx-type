import { BookingType } from "../models";
import { loginApi } from "../api/login";
import { VoucherItemType, ComboItemType } from "../models";
import {
  createReducer,
  createAsyncThunk,
  createAction,
} from "@reduxjs/toolkit";

export const onSelectCinema = createAction(
  "booking/onSelectCinema",
  (cinemaItem: VoucherItemType) => {
    return {
      payload: { ...cinemaItem },
    };
  }
);
export const onSelectCombo = createAction(
  "booking/onSelectCombo",
  (comboItem: ComboItemType) => {
    return {
      payload: { ...comboItem },
    };
  }
);
const initialState: BookingType = {
  chanelAndMethod: {
    chanel: {},
    method: {},
  },
  voucherType: {
    id: "",
    ["2d"]: {
      name: "",
      price: 0,
      type: "",
      planId: "",
    },
    ["3d"]: { name: "", price: 0, type: "", planId: "" },
  },
  comboItem: {
    name: "",
    price: 0,
    planId: "",
    type: "",
    cinemaId: "",
    ticketType: "",
  },
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
  builder.addCase(onSelectCombo, (state, action) => {
    return {
      ...state,
      comboItem: {
        ...action.payload,
      },
    };
  });
});
export default bookingReducer;
