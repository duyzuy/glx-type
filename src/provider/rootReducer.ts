import { Action } from "../models";
import userReducer, { userState } from "../reducer/user";
import deviceReducer, { deviceState } from "../reducer/device";
const initialState = {
  deviceInfo: deviceState,
  userInfo: userState,
};

const combineReducer = (slices: object) => (state: object, action: Action) => {
  Object.keys(slices).map((key) => {
    return {
      ...state,
    };
  });
};
const rootReducer = combineReducer({
  userInfo: userReducer,
  deviceInfo: deviceReducer,
});

export default rootReducer;
