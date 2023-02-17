import { UserInfo } from "../models";

const userState: Partial<UserInfo> = {
  phone: "",
  email: "",
};
type Action = {
  type: string;
  payload: object;
};
const userReducer = (state: UserInfo, action: Action) => {
  switch (action.type) {
  }
};
