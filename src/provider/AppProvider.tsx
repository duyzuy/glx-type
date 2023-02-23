import React, { useEffect, useReducer } from "react";
import AppContext from "../context/AppContext";
import useDevice from "../hooks/useDevice";
import rootReducer, { initialState } from "../reducer/rootReducer";
import {
  FETCH_DEVICE,
  FETCH_CAMPAIGN_INFOR,
  FETCH_SESSION,
} from "../constants/actions";
import client from "../api/client";

import { StorageKEY } from "../models";
import { logger } from "../hooks/logger";
const AppProvider: React.FC<{
  children: React.ReactNode;
  [keyName: string]: any;
}> = (props) => {
  const [state, dispatch] = useReducer(logger(rootReducer), initialState);
  const deviceInfor = useDevice();

  //FetchDevice
  const fetchDeviceInfo = async () => {
    let data = { token: "", ipAddress: "" };
    const bodyParams = {
      app_version: "2.0.0",
      modelId: deviceInfor.browser,
      modelName: "108",
      os: deviceInfor.os,
      os_version: deviceInfor.osVer,
      partner: deviceInfor.partner,
      platform: "web",
    };
    try {
      const response: {
        headers: Headers;
        data: { [keyName: string]: any };
        status: number;
      } = await client.post(`account/device/new`, {
        body: {
          ...bodyParams,
        },
      });

      if (response.status === 200) {
        const token = response.headers.get("x-fim-gtoken") || "";
        localStorage.setItem(StorageKEY.ipAddress, response.data.ip);
        localStorage.setItem(StorageKEY.deviceToken, token);
        data.token = token;
        data.ipAddress = response.data.ip;

        dispatch({
          type: FETCH_DEVICE,
          payload: {
            device: bodyParams,
            ipAddress: response.data.ip,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
    return data;
  };
  const fetchCampaignInfo = async ({ token = "" }) => {
    try {
      const response = await client.post(`promotion/v2/checkCampaignAcitve`, {
        body: {
          campaignId: [process.env.REACT_APP_CAMPAIGN_ID],
          eventPage: process.env.REACT_APP_EVENT_PAGE,
        },
        headers: {
          "access-token": token,
        },
      });
      dispatch({ type: FETCH_CAMPAIGN_INFOR, payload: response.data.data });
      localStorage.setItem(
        StorageKEY.campaignStatus,
        JSON.stringify({ isActive: response.data.data })
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    (async () => {
      const deviceToken = localStorage.getItem(StorageKEY.deviceToken) || "";
      if (deviceToken) {
        await fetchCampaignInfo({ token: deviceToken });
        dispatch({
          type: FETCH_DEVICE,
          payload: {
            device: {
              app_version: "2.0.0",
              modelId: deviceInfor.browser,
              modelName: "108",
              os: deviceInfor.os,
              os_version: deviceInfor.osVer,
              partner: deviceInfor.partner,
              platform: "web",
            },
            ipAddress: localStorage.getItem(StorageKEY.ipAddress),
          },
        });
      } else {
        const data = await fetchDeviceInfo();
        await fetchCampaignInfo({ token: data.token });
      }
    })();
  }, []);
  return (
    <AppContext.Provider value={[state, dispatch]}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppProvider;
