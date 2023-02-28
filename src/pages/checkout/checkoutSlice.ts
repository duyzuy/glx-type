import { createSlice } from "@reduxjs/toolkit";

import { fetchChanelAndMethod, fetchVoucherType } from "./actions";
import { VoucherItemType } from "../../models";
interface CheckOutState {
  chanelAndMethod: { channel: { [key: string]: any }; method: Array<{}> };
  voucherType: VoucherItemType[];
}

const initialState: CheckOutState = {
  chanelAndMethod: { channel: {}, method: [] },
  voucherType: [],
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
  },
});

export default checkoutSlice.reducer;
