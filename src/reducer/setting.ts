import { Action, DeviceInfo } from "../models";
import {
  FETCH_DEVICE,
  FETCH_IP_ADDRESS,
  FETCH_CAMPAIGN_INFOR,
} from "../constants/actions";

interface Setting {
  device: { [keyname: string]: any };
  ipAddress: string;
  campaignStatus: { isActive: boolean };
}
const settingState: Setting = {
  device: {},
  ipAddress: "",
  campaignStatus: { isActive: false },
};

const settingReducer = (state: object | null, action: any) => {
  switch (action.type) {
    case FETCH_DEVICE: {
      return {
        ...state,
        device: {
          ...action.payload.device,
        },
        ipAddress: action.payload.ipAddress,
      };
    }
    case FETCH_IP_ADDRESS: {
      return {
        ...state,
        ipAddress: action.payload,
      };
    }
    case FETCH_CAMPAIGN_INFOR: {
      return {
        ...state,
        campaignStatus: {
          isActive: action.payload,
        },
      };
    }
    default:
      return state;
  }
};

export default settingReducer;
export { settingState };
