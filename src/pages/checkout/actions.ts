import { checkoutApi } from "../../api/checkout";
import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchChanelAndMethod = createAsyncThunk(
  "checkout/fetchPaymentMethod",
  async () => {
    const response = await checkoutApi.fetchChanelAndMethod();
    return response;
  }
);
export { fetchChanelAndMethod };

export const fetchVoucherType = createAsyncThunk(
  "checkout/fetchVoucherType",
  async () => {
    const response = await checkoutApi.getVoucherType();

    return response;
  }
);
