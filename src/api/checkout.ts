import {
  ChannelItemType,
  MethodItemType,
  OfferItemType,
  StorageKEY,
  VoucherItemType,
} from "../models";
import client from "./client";

export const checkoutApi = {
  fetchChanelAndMethod: async (args?: {
    platform?: string;
    version?: string;
  }): Promise<{
    error: number;
    data: {
      method: MethodItemType[];
      channel: ChannelItemType[];
    };
    [key: string]: any;
  }> => {
    const { version = "1.3", platform = "web" } = args || {};
    const authToken = localStorage.getItem(StorageKEY.authToken);
    let responseData: {
      data: { method: MethodItemType[]; channel: ChannelItemType[] };
      error: number;
    } = { data: { method: [], channel: [] }, error: 0 };
    try {
      const response = await client.get(
        `billing/channel/channelAndMethod?platform=${platform}&version=${version}`,
        {
          headers: {
            "access-token": authToken,
            //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiIyOGNmZGVkNS1kM2ZhLTQ4YWEtOGYwNy0zMGY3N2RlNTE4M2UiLCJqdGkiOiI0YWFkYWQ1Zi0wYjZmLTQ4OWItOWE4Zi01ZmFkMTcwZWE3MjYiLCJ1aWQiOiI1OTBlMWM0Yy03YmNjLTRlYzYtOGVlNS0zMjVlMGFkMjQzMWYiLCJtaWQiOiJOb25lIiwiZGlkIjoiNzA1OWExMWItODJjNy00YWJiLWE2MzAtYTBkNmY5ZTU0ZTRhIiwicGx0Ijoid2VifHBjfG1hY29zeHwxMF8xNV83fGNocm9tZSIsImlwIjoiMS41NS4zOC4yNDYiLCJ4aWQiOiI2UDE2Nzc1MDkzOTEiLCJhcHBfdmVyc2lvbiI6IjIuMC4wIiwiY2F0IjoiMTY3NzUwOTM5MSIsInRhZ3MiOltdLCJpYXQiOjE2Nzg3MTgwNjcsImV4cCI6MTY3ODgwNDQ2N30._buV4rM6eLOkZfeakst-zYo4p8QZ3svT_Mjh-nx7cTI",
          },
        }
      );

      if (response.data.error === 0) {
        responseData = {
          data: response.data.data,
          error: response.data.error,
        };
      } else {
        responseData = {
          error: response.data.errorCode,
          data: {
            method: [],
            channel: [],
          },
          ...response.data,
        };
      }
    } catch (error) {
      console.log({ error });
    }

    return responseData;
  },
  getVoucherType: async (): Promise<{
    data: VoucherItemType[];
    error: number;
    message: string;
  }> => {
    const authToken = localStorage.getItem(StorageKEY.authToken);
    const campaignId = process.env.REACT_APP_CAMPAIGN_ID;
    let responseData = {
      data: [],
      error: 0,
      message: "",
    };
    try {
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
      if (response.data.error === 0) {
        responseData = {
          ...response.data,
        };
      } else {
        responseData = {
          ...responseData,
          ...response.data,
        };
      }
    } catch (error) {
      console.log(error);
    }
    return responseData;
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
