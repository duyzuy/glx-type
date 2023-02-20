import { StorageKEY } from "../models";
export const deviceToken: string =
  localStorage.getItem(StorageKEY.deviceToken) || "";
export const authToken: string =
  localStorage.getItem(StorageKEY.authToken) || "111";
export const rfToken: string = localStorage.getItem("glx_auth_rftoken") || "";
export const isActiveCampaign: boolean = JSON.parse(
  localStorage.getItem(StorageKEY.campaignStatus) || "true"
);
