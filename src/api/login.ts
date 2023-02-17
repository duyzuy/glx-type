import client from "./client";
import { deviceToken } from "../utils/storageVariables";
interface AccountInfo {
  phone: number;
  code?: number;
  password?: string;
}

export const loginApi = {
  checkAccount: async ({ phone }: Pick<AccountInfo, "phone">) => {
    return await client.get(`account/phone/check/${phone}`);
  },
  verifyPhoneNumber: async (phone: Pick<AccountInfo, "phone">) => {
    return await client
      .post(`account/phone/verify?phone=${phone}`, {
        body: {
          phone: phone,
        },
      })
      .then((response) => {
        console.log({ response });
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};

export const createAccount = async ({
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
      "access-token": deviceToken,
    },
    body: bodyData,
  });

  const authToken = response.headers.get("x-fim-atoken");
  const authRfToken = response.headers.get("x-fim-rtoken");

  return {
    data: response.data,
    token: authToken,
    rfToken: authRfToken,
  };
};

export const getOffer = async ({ phone }: Pick<AccountInfo, "phone">) => {
  return await client.post(`promotion/v2/getOffer`, {
    body: {
      campaignId: process.env.REACT_APP_CAMPAIGN_ID,
      eventPage: process.env.REACT_APP_EVENT_PAGE,
      phone: phone,
    },
  });
};

export const forgotPassword = async ({ phone }: Pick<AccountInfo, "phone">) => {
  return await client.post(`account/phone/forgot?phone=${phone}`, {
    body: { phone },
  });
};

export const loginAccount = async ({ phone, code, password }: AccountInfo) => {
  let bodyData: { phone: number; code?: number; password?: string } = {
    phone: phone,
  };

  let BASE_URL = `/account/login?phone=${phone}`;
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
    body: bodyData,
  });
  const authToken = response.headers.get("x-fim-atoken");
  const authRfToken = response.headers.get("x-fim-rtoken");

  return {
    data: response.data,
    token: authToken,
    rfToken: authRfToken,
  };
};
export const updatePassword = async (password: string) => {
  const authToken = localStorage.getItem("glx-auth-token") || "";

  const response = await client.post(`account/update`, {
    headers: {
      "access-token": authToken,
    },
    body: {
      newPassword: password,
    },
  });

  return response.data;
};

export const getUserInfor = async () => {
  const authToken = localStorage.getItem("glx-auth-token") || "";

  const response = await client.get(`account/info`, {
    headers: {
      "access-token": authToken,
    },
  });

  return response.data;
};
