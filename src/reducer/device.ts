import { Action, DeviceInfo } from "../models";
import { FETCH_DEVICE } from "../constants/actions";

const deviceState: Partial<DeviceInfo> = {
  info: {},
  ipAddress: "",
};

const deviceReducer = (state: Partial<DeviceInfo>, action: Action) => {
  switch (action.type) {
    case FETCH_DEVICE: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};

export default deviceReducer;
export { deviceState };
