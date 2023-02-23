export interface UserInfo {
  token: string;
  profile: { phone: string; email: string; [key: string]: any };
}
