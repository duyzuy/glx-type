export interface Configs {
  body: BodyInit;
  headers: HeadersInit;
  method: string;
}

export interface Action {
  type: string;
  payload: { [keyName: string]: any };
}
export interface StateInit {
  userInfo: { [key: string]: any };
  setting: { [key: string]: any };
}
export interface Setting {
  campaignInfo: object;
}

export enum StorageKEY {
  deviceToken = "glx_device_token",
  authToken = "glx_auth_token",
  refreshToken = "glx_rf_token",
  campaignStatus = "glx_campaign_status",
  ipAddress = "glx_ipAddress",
}
export type ReducerKeys = "userInfo" | "setting";

export interface VoucherItemType {
  id?: string;
  ["2d"]?:
    | {
        name: string;
        price: number;
        type: string;
        planId: string;
      }
    | boolean;
  ["3d"]?:
    | { name: string; price: number; type: string; planId: string }
    | boolean;
}
export interface ComboItemType {
  name?: string;
  price?: number;
  type?: string;
  planId?: string;
  cinemaId?: string;
  ticketType?: string;
}

export type ChanelItemType = {
  id?: string;
  name?: string;
  type?: string;
  versionFrom?: string;
  ico?: string;
  active?: boolean;
  priority?: number;
};
export type MethodItemType = {
  createdAt?: string;
  channelName?: string;
  displayName?: string;
  channelId?: string;
  methodId?: string;
  versionFrom?: string;
  versionTo?: string;
  momoWalletId?: string;
  panFirst6?: string;
  panLast4?: string;
  displayWallet?: string;
  ico?: string;
};
export enum TicketKeys {
  Two = "2d",
  Third = "3d",
}
export enum TicketType {
  Premium = "premium",
  Platinum = "platinum",
}

export enum WalletName {
  MOMO = "MOMO",
  VNPAY = "VNPAY",
  ASIAPAY = "ASIAPAY",
  ZALOPAY = "ZALOPAY",
  SHOPEEPAY = "SHOPEEPAY",
  MOCA = "MOCA",
  FUNDIIN = "FUNDIIN",
}

export interface MethodDetailType {
  qrcode_url?: string;
  key?: string;
  token?: string;
  request_id?: string;
  redirect_url_web?: string;
  redirect_url_qr?: string;
  errcode?: number;
  debug_msg?: string;
}

export interface PaymentDataType {
  qrCodeUrl?: string;
  token?: string;
  requestId?: string;
  key?: string;
  resultCode?: string;
  redirectUrlWeb?: string;
  redirectUrlQr?: string;
  message?: string;
}
