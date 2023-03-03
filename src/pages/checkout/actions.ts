import { checkoutApi } from "../../api/checkout";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { PaymentDataType } from "../../models";
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
    let reponseData: PaymentDataType = {};
    const { channelType } = args;
    const response = await checkoutApi.syncPaymentMethod(args);

    if (response.error === 0) {
      const { data } = response;
      switch (channelType) {
        case "zalo": {
          reponseData = {
            qrCodeUrl: data.url,
            token: data.token,
            resultCode: data.resultCode,
            key: data.key,
            message: data.message,
          };
          break;
        }
        case "shopee": {
          reponseData = {
            qrCodeUrl: data.qrcode_url,
            token: data.token,
            resultCode: data.resultCode,
            key: data.key,
            message: data.debug_msg,
            redirectUrlQr: data.redirect_url_qr,
            redirectUrlWeb: data.redirect_url_web,
            requestId: data.request_id,
          };
        }
      }
    }
    return reponseData;
  }
);

export const onlistenHubPayment = createAsyncThunk(
  "checkout/onlistenHubPayment",
  async (args: { channelType: string; token: string }) => {
    const { channelType, token } = args;

    const response = await checkoutApi.onlistenHubPayment({
      channelType,
      token,
    });
    return response;
  }
);
