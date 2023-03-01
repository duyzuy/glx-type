import { StorageKEY } from "../models";
import client from "./client";

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
};

// export const syncPaymentMethod = async (params = {}) => {
//   const authToken = localStorage.getItem("glx-auth-token") || "";

//   const configs = {
//     method: "POST",
//     cache: "no-cache",
//     headers: {
//       "Content-Type": "application/json",
//       "access-token": authToken,
//     },
//   };
//   configs.body = JSON.stringify(params);
//   const response = await fetch(
//     `${process.env.REACT_APP_API_URL}/billing/zalo/sync`,
//     {
//       ...configs,
//     }
//   );
//   const data = await response.json();
//   return data;
// };

// export const hubPaymentMethod = async (paymentToken) => {
//   const configs = {
//     method: "GET",
//     cache: "no-cache",
//     headers: {
//       accept: "text/event-stream",
//       "access-token": paymentToken,
//     },
//   };

//   const response = await fetch(process.env.REACT_APP_API_HUB_URL, configs);

//   const data = await response.json();
//   return data;
// };

// export const makePayment = async ({ methodId, offer }) => {
//   const authToken = localStorage.getItem("glx-auth-token") || "";

//   const configs = {
//     method: "POST",
//     cache: "no-cache",
//     headers: {
//       "Content-Type": "application/json",
//       "access-token": authToken,
//     },
//   };
//   configs.body = JSON.stringify({
//     methodId,
//     offer,
//   });
//   const response = await fetch(
//     `${process.env.REACT_APP_API_URL}/billing/subscription/buy`,
//     configs
//   );

//   const data = await response.json();
//   return data;
// };

// export const getAcountWalletInfor = async ({ authCode, requestId, userId }) => {
//   const authToken = localStorage.getItem("glx-auth-token") || "";

//   const configs = {
//     method: "POST",
//     cache: "no-cache",
//     headers: {
//       "Content-Type": "application/json",
//       "access-token": authToken,
//     },
//   };
//   configs.body = JSON.stringify({
//     authCode,
//     requestId,
//     userId,
//   });
//   const response = await fetch(
//     `${process.env.REACT_APP_API_URL}/billing/shopee/confirm`,
//     configs
//   );

//   const data = await response.json();
//   return data;
// };
