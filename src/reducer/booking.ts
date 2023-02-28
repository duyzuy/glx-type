import { BookingType } from "../models";
import { loginApi } from "../api/login";
import { VoucherItemType } from "../models";
import {
  createReducer,
  createAsyncThunk,
  createAction,
} from "@reduxjs/toolkit";

export const onSelectCinema = createAction(
  "booking/onSelectCinema",
  (cinemaItem: VoucherItemType) => {
    console.log(cinemaItem);
    return {
      payload: { ...cinemaItem },
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
});
export default bookingReducer;
