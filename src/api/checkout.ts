import {
  ChanelItemType,
  MethodItemType,
  OfferItemType,
  StorageKEY,
} from "../models";
import client from "./client";

export const checkoutApi = {
  fetchChanelAndMethod: async (args?: {
    platform?: string;
    version?: string;
  }): Promise<{
    error: number;
    data: {
      method?: MethodItemType[];
      channel?: ChanelItemType[];
    };
  }> => {
    const { version = "1.3", platform = "web" } = args || {};
    const authToken = localStorage.getItem(StorageKEY.authToken);
    const response = await client.get(
      `billing/channel/channelAndMethod?platform=${platform}&version=${version}`,
      {
        headers: {
          "access-token": authToken,
        },
      }
    );
    if (response.data.error === 0) {
      return {
        data: response.data.data,
        error: response.data.error,
      };
    } else {
      return {
        ...response.data,
        error: response.data.error,
      };
    }
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

    return response.data;
  },
};
