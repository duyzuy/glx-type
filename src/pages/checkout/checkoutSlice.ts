import { createSlice } from "@reduxjs/toolkit";

import {
  fetchChanelAndMethod,
  fetchVoucherType,
  fetchPromotionsOffer,
} from "./actions";
import { VoucherItemType, ChanelItemType, MethodItemType } from "../../models";
interface CheckOutState {
  chanelAndMethod: { channel: ChanelItemType[]; method: MethodItemType[] };
  voucherType: VoucherItemType[];
  promotionsOffer: object;
}

const initialState: CheckOutState = {
  chanelAndMethod: { channel: [], method: [] },
  voucherType: [],
  promotionsOffer: {},
};
const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchChanelAndMethod.fulfilled, (state, action) => {
      return {
        ...state,
        chanelAndMethod: {
          channel: action?.payload?.data?.channel,
          method: action?.payload?.data.method,
        },
      };
    });
    builder.addCase(fetchVoucherType.fulfilled, (state, action) => {
      return {
        ...state,
        voucherType: [...action?.payload?.data],
      };
    });
    builder.addCase(fetchPromotionsOffer.fulfilled, (state, action) => {
      return {
        ...state,
        promotionsOffer: { ...action?.payload?.data },
      };
    });
  },
});

export default checkoutSlice.reducer;
