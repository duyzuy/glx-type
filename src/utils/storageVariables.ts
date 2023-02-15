export const deviceToken: string =
  localStorage.getItem("glx_device_token") || "";
export const authToken: string =
  localStorage.getItem("glx_auth_token") || "111";
export const rfToken: string = localStorage.getItem("glx_auth_rftoken") || "";
export const isActiveCampaign: boolean = JSON.parse(
  localStorage.getItem("glx_campaign_active") || "true"
);
