import { OfferItemType, StorageKEY } from "../models";
import client from "./client";
import { fetchEventSource } from "@microsoft/fetch-event-source";
export const checkoutApi = {
  fetchChanelAndMethod: async (options?: { [key: string]: any }) => {
    const { version = "1.3", platform = "web" } = options || {};
    const authToken = localStorage.getItem(StorageKEY.authToken);
    const response = await client.get(
      `billing/channel/channelAndMethod?platform=${platform}&version=${version}`,
      {
        headers: {
          "access-token": authToken,
        },
      }
    );

    return response.data;
  },
  getVoucherType: async () => {
    const authToken = localStorage.getItem(StorageKEY.authToken);
    const campaignId = process.env.REACT_APP_CAMPAIGN_ID;
    const response = await client.post(
      `promotion/v2/landingpage/checkVoucherType`,
      {
        headers: {
          "access-token": authToken,
        },
        body: {
          campaignId: campaignId,
        },
      }
    );
    return response.data;
  },

  getPromotionOffer: async (options: {
    cinemaBranch: string;
    cinemaPackageType: string;
    cinemaType: string;
  }) => {
    const { cinemaBranch, cinemaPackageType, cinemaType } = options;
    const authToken = localStorage.getItem(StorageKEY.authToken);

    const response = await client.post(`promotion/v2/getOffer`, {
      headers: {
        "access-token": authToken,
      },
      body: {
        campaignId: process.env.REACT_APP_CAMPAIGN_ID,
        eventPage: process.env.REACT_APP_EVENT_PAGE,
        mkt_campaign: process.env.REACT_APP_MKT_CAMPAIGN,
        cinemaBranch: cinemaBranch,
        cinemaPackageType,
        cinemaType,
      },
    });

    return response.data;
  },

  syncPaymentMethod: async (args: {
    channelType: string;
    clientId: string;
    returnUrl: string;
  }) => {
    const authToken = localStorage.getItem(StorageKEY.authToken);
    const { channelType, clientId, returnUrl } = args;
    const response = await client.post(`billing/${channelType}/sync`, {
      headers: {
        "access-token": authToken,
      },
      body: {
        channelType,
        clientId,
        returnUrl,
      },
    });

    return response.data;
  },
  makePayment: async (args: { methodId: string; offer: OfferItemType }) => {
    const authToken = localStorage.getItem(StorageKEY.authToken);
    const { methodId, offer } = args;
    const response = await client.post(`billing/subscription/buy`, {
      headers: {
        "access-token": authToken,
      },
      body: {
        methodId,
        offer,
      },
    });
  },
};

function Utf8ArrayToStr(array: any) {
  var out, i, len, c;
  var char2, char3;

  out = "";
  len = array.length;
  i = 0;
  while (i < len) {
    c = array[i++];
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(
          ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
        );
        break;
    }
  }

  return out;
}
