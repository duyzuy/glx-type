import client from "./client";
import { deviceToken } from "../utils/storageVariables";
import { StorageKEY } from "../models";
interface AccountInfo {
  phone: any;
  code?: any;
  password?: string;
}

export const loginApi = {
  checkAccount: async ({
    phone,
  }: Pick<AccountInfo, "phone">): Promise<{
    code: number;
    message: string;
  }> => {
    const response = await client.get(`account/phone/check/${phone}`, {
      headers: {
        "access-token": localStorage.getItem(StorageKEY.deviceToken) || "",
      },
    });
    return response.data;
  },
  verifyPhoneNumber: async (phone: string) => {
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
    let bodyData: Pick<AccountInfo, "phone" | "code"> = { phone, code };

    const response = await client.post(
      `account/phone/register?phone=${phone}&code=${code}`,
      {
        headers: {
          "access-token": localStorage.getItem(StorageKEY.deviceToken) || "",
        },
        body: { ...bodyData },
      }
    );
    const authToken = response.headers.get("x-fim-atoken") || "";
    const authRfToken = response.headers.get("x-fim-rtoken") || "";

    return {
      data: response.data,
      token: authToken,
      rfToken: authRfToken,
    };
  },

  createPassword: async ({
    password,
    token,
  }: {
    password: string;
    token: string;
  }) => {
    const response = await client.post(`account/update`, {
      headers: {
        "access-token": token,
      },
      body: {
        newPassword: password,
      },
    });

    return response.data;
  },

  forgotPassword: async ({ phone }: Pick<AccountInfo, "phone">) => {
    return await client.post(`account/phone/forgot?phone=${phone}`, {
      body: { phone },
      headers: {
        "access-token": localStorage.getItem(StorageKEY.deviceToken),
      },
    });
  },

  makeLogin: async ({
    phone,
    password,
    code,
  }: {
    phone: string;
    password?: string;
    code?: string;
  }) => {
    let bodyData: { phone: string; code?: string; password?: string } = {
      phone,
    };

    let BASE_URL = `account/login?phone=${phone}`;
    if (code) {
      BASE_URL = BASE_URL.concat(`&code=${code}`);
      bodyData = {
        ...bodyData,
        code: code,
      };
    }
    if (password) {
      bodyData = {
        ...bodyData,
        password: password,
      };
    }

    const response = await client.post(BASE_URL, {
      body: {
        ...bodyData,
      },
      headers: {
        "access-token": localStorage.getItem(StorageKEY.deviceToken),
      },
    });
    const authToken = response.headers.get("x-fim-atoken") || "";
    const authRfToken = response.headers.get("x-fim-rtoken") || "";

    return {
      data: response.data,
      token: authToken,
      rfToken: authRfToken,
    };
  },

  getUserInfor: async (token?: string) => {
    const response = await client.get(`account/info`, {
      headers: {
        "access-token": token,
      },
    });

    return response.data;
  },
};
