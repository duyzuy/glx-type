import { checkoutApi } from "../../api/checkout";
import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { isEmpty } from "../../utils/common";
import {
  ChannelItemType,
  MethodItemType,
  OfferItemType,
  PaymentDataType,
  ComboItemType,
  WalletName,
  VoucherItemType,
} from "../../models";

export const fetchChanelAndMethod = createAsyncThunk(
  "checkout/fetchPaymentMethod",
  async () => {
    const response = await checkoutApi.fetchChanelAndMethod();
    return response;
  }
);

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
export const setChannelAndMethod = createAction(
  "checkout/setChannelAndMethod",
  (args: { channel: ChannelItemType; method: MethodItemType }) => {
    const { channel, method } = args;
    return {
      payload: {
        channel,
        method,
      },
    };
  }
);
export const fetchPaymentChannelData = createAsyncThunk(
  "checkout/fetchPaymentChannelData",
  async (args: {
    channelType: string;
    clientId: string;
    returnUrl: string;
  }) => {
    let channelResponse: PaymentDataType = {};
    const { channelType, clientId, returnUrl } = args;
    const response = await checkoutApi.syncPaymentMethod({
      channelType,
      clientId,
      returnUrl,
    });

    if (response.error === 0) {
      const { data } = response;
      switch (channelType) {
        case "zalo": {
          channelResponse = {
            qrCodeUrl: data.url,
            token: data.token,
            resultCode: data.resultCode,
            key: data.key,
            message: data.message,
          };
          break;
        }
        case "shopee": {
          channelResponse = {
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
    return {
      error: response.error,
      message: response.message,
      syncData: channelResponse,
    };
  }
);
export const showActiveMethod = createAction(
  "checkout/showActiveMethod",
  (method: MethodItemType) => {
    return {
      payload: {
        method,
      },
    };
  }
);
export const onSelectCinema = createAction(
  "booking/onSelectCinema",
  (cinemaItem: VoucherItemType) => {
    return {
      payload: { ...cinemaItem },
    };
  }
);

export const onSelectCombo = createAsyncThunk(
  "booking/onSelectCombo",
  async (args: { channelType: string; comboItem: ComboItemType }, thunkApi) => {
    const { channelType, comboItem } = args;
    let data: { comboItem: ComboItemType; offer: OfferItemType } = {
      comboItem,
      offer: {},
    };
    const response = await thunkApi
      .dispatch(
        fetchPromotionsOffer({
          cinemaBranch: comboItem.cinemaId || "",
          cinemaPackageType: comboItem.type || "",
          cinemaType: comboItem.ticketType || "",
        })
      )
      .unwrap();

    if (response.error === 0) {
      const { nonPromotionOffers } = response.data;

      const offer = nonPromotionOffers.svod[comboItem.type || ""];
      switch (channelType) {
        case "zalo": {
          data.offer = offer[WalletName.ZALOPAY][0];
          break;
        }
        case "shopee": {
          data.offer = offer[WalletName.SHOPEEPAY][0];
          break;
        }
        case "vnpay": {
          data.offer = offer[WalletName.VNPAY][0];
          break;
        }
        case "moca": {
          data.offer = offer[WalletName.MOCA][0];
          break;
        }
      }
    }
    return {
      ...data,
      error: response.error,
      message: response.message,
    };
  }
);

export const onResetComboSelect = createAction(
  "booking/onResetComboSelect",
  () => {
    return {
      payload: {
        comboItem: {},
        offer: {},
      },
    };
  }
);

export const onResetPaymentData = createAction(
  "booking/onResetPaymentData",
  () => {
    return {
      payload: {
        paymentData: {},
      },
    };
  }
);
