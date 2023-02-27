export interface UserInfo {
  token: string;
  profile: { phone?: string; email?: string; [key: string]: any };
  isLogedin: boolean;
}
export enum RegisterKeys {
  phoneNumber = "phoneNumber",
  otpCode = "otpCode",
  password = "password",
  nextAction = "nextAction",
  token = "token",
  rfToken = "rfToken",
}
