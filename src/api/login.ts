import client from "./client";
import { deviceToken } from "../utils/storageVariables";
import { StorageKEY } from "../models";
interface AccountInfo {
  phone: any;
  code?: any;
  password?: string;
}

export const loginApi = {
  checkAccount: async ({ phone }: Pick<AccountInfo, "phone">) => {
    const response = await client.get(`account/phone/check/${phone}`, {
      headers: {
        "access-token": localStorage.getItem(StorageKEY.deviceToken) || "",
      },
    });
    return response.data;
  },
  verifyPhoneNumber: async (phone: Pick<AccountInfo, "phone">) => {
    const response = await client.post(`account/phone/verify?phone=${phone}`, {
      body: {
        phone: phone,
      },
      headers: {
        "access-token": localStorage.getItem(StorageKEY.deviceToken) || "",
      },
    });

    return response.data;
  },
  getOffer: async ({ phone }: Pick<AccountInfo, "phone">) => {
    const response = await client.post(`promotion/v2/getOffer`, {
      body: {
        campaignId: process.env.REACT_APP_CAMPAIGN_ID,
        eventPage: process.env.REACT_APP_EVENT_PAGE,
        phone: phone,
      },
      headers: {
        "access-token": localStorage.getItem(StorageKEY.deviceToken) || "",
      },
    });

    return response.data;
  },
  createAccount: async ({
    phone,
    code,
  }: Pick<AccountInfo, "phone" | "code">) => {
    let bodyData: Pick<AccountInfo, "phone" | "code"> = { phone };

    let URL = `account/phone/register?phone=${phone}`;

    if (code) {
      URL = URL.concat(`&code=${code}`);
      bodyData = {
        ...bodyData,
        code,
      };
    }

    const response = await client.post(URL, {
      headers: {
        "access-token": localStorage.getItem(StorageKEY.deviceToken) || "",
      },
      body: bodyData,
    });
    if (response.status === 200) {
      const authToken = response.headers.get("x-fim-atoken");
      const authRfToken = response.headers.get("x-fim-rtoken");

      return {
        data: response.data,
        token: authToken,
        rfToken: authRfToken,
      };
    } else {
      return {
        data: response.data,
      };
    }
  },

  updatePassword: async (password: Pick<AccountInfo, "password">) => {
    const response = await client.post(`account/update`, {
      headers: {
        "access-token": localStorage.getItem(StorageKEY.deviceToken) || "",
      },
      body: {
        newPassword: password,
      },
    });

    return response.data;
  },
};

// export const forgotPassword = async ({ phone }: Pick<AccountInfo, "phone">) => {
//   return await client.post(`account/phone/forgot?phone=${phone}`, {
//     body: { phone },
//   });
// };

// export const loginAccount = async ({ phone, code, password }: AccountInfo) => {
//   let bodyData: { phone: number; code?: number; password?: string } = {
//     phone: phone,
//   };

//   let BASE_URL = `/account/login?phone=${phone}`;
//   if (code) {
//     BASE_URL = BASE_URL.concat(`&code=${code}`);
//     bodyData = {
//       ...bodyData,
//       code: code,
//     };
//   }
//   if (password) {
//     bodyData = {
//       ...bodyData,
//       password: password,
//     };
//   }

//   const response = await client.post(BASE_URL, {
//     body: bodyData,
//   });
//   const authToken = response.headers.get("x-fim-atoken");
//   const authRfToken = response.headers.get("x-fim-rtoken");

//   return {
//     data: response.data,
//     token: authToken,
//     rfToken: authRfToken,
//   };
// };

// export const getUserInfor = async () => {
//   const authToken = localStorage.getItem("glx-auth-token") || "";

//   const response = await client.get(`account/info`, {
//     headers: {
//       "access-token": authToken,
//     },
//   });

//   return response.data;
// };
