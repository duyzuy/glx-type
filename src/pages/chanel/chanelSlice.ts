import { createSlice } from "@reduxjs/toolkit";
import { fetchCampaignInfo, fetchDeviceInfo, fetchOffer } from "./actions";
import { DeviceInfoType } from "../../models";
interface ChanelInfoState {
  chanelName: string;
  campaignStatus: { isActive: boolean };
  deviceInfo: DeviceInfoType;
  ipAddress: string;
  offer: object;
}

const initialState = {
  chanelName: "",
  campaignStatus: { isActive: false },
  deviceInfo: {},
  ipAddress: "",
} as ChanelInfoState;
const chanelSlice = createSlice({
  name: "chanel",
  initialState,
  reducers: {
    fetchChanelName: (state, action) => {
      return {
        ...state,
        chanelName: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDeviceInfo.fulfilled, (state, action) => {
      return {
        ...state,
        deviceInfo: { ...action.payload.device },
        ipAddress: action.payload.ipAddress,
      };
    });
    builder.addCase(fetchCampaignInfo.fulfilled, (state, action) => {
      return {
        ...state,
        campaignStatus: {
          isActive: action.payload.data,
        },
      };
    });
    builder.addCase(fetchOffer.fulfilled, (state, action) => {
      return {
        ...state,
        offer: {
          ...action.payload.data,
        },
      };
    });
  },
});

export default chanelSlice.reducer;
export const { fetchChanelName } = chanelSlice.actions;
