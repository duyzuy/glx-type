import client from "./client";

interface AccountInfo {
  phone: number;
  code?: number;
}
interface BodyData {
  phone: number;
  code?: number;
}
export const checkAccount = async (phoneNumber: Pick<AccountInfo, "phone">) => {
  return await client.get(`account/phone/check/${phoneNumber}`);
};
export const verifyPhoneNumber = async (
  phoneNumber: Pick<AccountInfo, "phone">
) => {
  return await client
    .post(`account/phone/verify?phone=${phoneNumber}`, {
      body: {
        phone: phoneNumber,
      },
    })
    .then((response) => {
      console.log({ response });
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const createAccount = async ({ phone, code }: AccountInfo) => {
  const deviceToken = localStorage.getItem("glx-token-device") || "";
  let bodyData: BodyData = { phone: phone };
  const configs = {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      "access-token": deviceToken,
    },
  };

  let INPUT = `account/phone/register?phone=${phone}`;
  if (code) {
    INPUT = INPUT.concat(`&code=${code}`);
    bodyData = {
      ...bodyData,
      code,
    };
  }

  const response = await client.post(INPUT, {
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
