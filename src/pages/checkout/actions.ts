import { checkoutApi } from "../../api/checkout";
import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { isEmpty } from "../../utils/common";
import {
  ChanelItemType,
  MethodItemType,
  OfferItemType,
  PaymentDataType,
} from "../../models";
import { fetchEventSource } from "@microsoft/fetch-event-source";

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
export const setChannelAndMethod = createAction(
  "checkout/fetchChanelAndMethodCampaign",
  (args: { channel: ChanelItemType; method: MethodItemType }) => {
    const { channel, method } = args;
    return {
      payload: {
        channel,
        method,
      },
    };
  }
);
export const onSelectPaymentMethod = createAsyncThunk(
  "checkout/onSelectPaymentMethod",
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
      syncData: channelResponse,
    };
  }
);

export const onlistenHubPayment = createAsyncThunk(
  "checkout/onlistenHubPayment",
  async (args: {
    channelType: string;
    token: string;
    offer: OfferItemType;
  }) => {
    const { channelType, token } = args;
    let inputUrl = "";
    switch (channelType) {
      case "zalo": {
        inputUrl = "zalopay";
        break;
      }
      case "shopee": {
        inputUrl = "shopeepay";
        break;
      }
    }
    await fetchEventSource(`${process.env.REACT_APP_API_HUB_URL}/${inputUrl}`, {
      method: "GET",
      headers: {
        accept: "text/event-stream",
        "access-token": token,
        "content-type": "text/event-stream",
      },
      openWhenHidden: true,
      onopen: async (response) => {
        console.log({ response });
        if (response.status === 200) {
          //settimer
          console.log("oke");
        }
      },
      onmessage: async (data) => {
        console.log(data);
      },
      onclose: async () => {
        console.log("closed");
      },
    });
  }
);
