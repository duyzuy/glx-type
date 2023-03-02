export interface ProfileInfoType {
  id?: string;
  shortId?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  active?: string;
  language?: string;
  pendingEmail?: string;
  platform?: string;
  imageUrl?: string;
  resolution?: string;
  subtitle?: string;
  version?: string;
  registerBy?: string;
  createdAt?: string;
  updatedAt?: string;
  newLayer?: string;
  gender?: number;
  contextValue?: string;
  favoriteFilm?: string;
  updatePassword?: boolean;
  inActiveDelete?: number;
  linkReferral?: string;
  userInvite?: string;
  imageUrlReferral?: string;
}
export interface UserInfoType {
  token: string;
  profile: ProfileInfoType;
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
