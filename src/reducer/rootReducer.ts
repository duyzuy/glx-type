import { Action } from "../models";
import settingReducer, { settingState } from "./setting";
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
  setting: settingState,
  userInfo: {},
};
const rootReducer = combineReducer({
  userInfo: () => {},
  setting: settingReducer,
});

export default rootReducer;
export { initialState };
