import { UserInfo, Action } from "../models";
import { FETCH_USER_INFO } from "../constants/actions";
const userInfoState: Partial<UserInfo> = {
  phone: "",
  email: "",
};

const userReducer = (state: Partial<UserInfo>, action: Action) => {
  switch (action.type) {
    case FETCH_USER_INFO: {
      return {
        ...action.payload,
      };
    }
    default:
      return state;
  }
};
export default userReducer;
export { userInfoState };
