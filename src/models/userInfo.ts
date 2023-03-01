export interface ProfileInfo {
  phone?: string;
  email?: string;
  [key: string]: any;
}
export interface UserInfo {
  token: string;
  profile: ProfileInfo;
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
