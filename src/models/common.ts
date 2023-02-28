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
  id: string;
  ["2d"]:
    | {
        name: string;
        price: number;
        type: string;
        planId: string;
      }
    | boolean;
  ["3d"]:
    | { name: string; price: number; type: string; planId: string }
    | boolean;
}
export interface ComboItemType {
  name: string;
  price: number;
  type: string;
  planId: string;
  cinemaId: string;
  ticketType: string;
}
export interface BookingType {
  chanelAndMethod: {
    chanel: {};
    method: {};
  };
  voucherType: VoucherItemType;
  comboItem: ComboItemType;
}

export enum TicketKeys {
  Two = "2d",
  Third = "3d",
}
export enum TicketType {
  Premium = "premium",
  Platinum = "platinum",
}
