export interface Configs {
  body: BodyInit;
  headers: HeadersInit;
  method: string;
}

export interface StateInit {
  booking: object;
  userInfo: {
    phone: string | "";
    email: string | "";
  };
  promotions: object;
  paymentMethods: object;
  device: object;
  campaign: object;
}
export interface Setting {
  campaignInfo: object;
}
