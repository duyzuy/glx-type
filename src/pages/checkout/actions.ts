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

export const fetchPromotionsOffer = createAsyncThunk(
  "checkout/fetchPromotionsOffer",
  async (options: {
    cinemaBranch: string;
    cinemaPackageType: string;
    cinemaType: string;
  }) => {
    const response = await checkoutApi.getPromotionOffer({ ...options });

    return response;
  }
);

export const onSelectPaymentMethod = createAsyncThunk(
  "checkout/onSelectPaymentMethod",
  async (args: {
    channelType: string;
    clientId: string;
    returnUrl: string;
  }) => {
    const response = await checkoutApi.syncPaymentMethod(args);

    if (response.error === 0) {
      return response.data;
    }
    return {};
  }
);
