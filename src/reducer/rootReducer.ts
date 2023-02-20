import { Action } from "../models";
import userReducer, { userInfoState } from "./user";
import deviceReducer, { deviceState } from "./device";
import { ReducerKeys } from "../models";

const combineReducer =
  (slices: Record<ReducerKeys, Function>) => (state: any, action: any) => {
    const initState = {};
    return Object.keys(slices).reduce((acc, current) => {
      return {
        ...acc,
        [current]: slices[current as keyof typeof slices](
          state[current],
          action
        ),
      };
    }, initState);
  };

const initialState: Record<ReducerKeys, object> = {
  deviceInfo: deviceState,
  userInfo: userInfoState,
};
const rootReducer = combineReducer({
  userInfo: userReducer,
  deviceInfo: deviceReducer,
});

export default rootReducer;
export { initialState };
