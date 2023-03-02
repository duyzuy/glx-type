import { useEffect } from "react";
import client from "../api/client";
import { StorageKEY } from "../models";
import useDevice from "../hooks/useDevice";
import { fetchDeviceInfo, fetchCampaignInfo } from "./chanel/actions";
import { fetchChanelName } from "./chanel/chanelSlice";
import { useAppDispatch } from "../app/hooks";
import { fetchUserInfo } from "../reducer/user";
import { useParams } from "react-router-dom";

const AppComponent = () => {
  const deviceInfor = useDevice();
  const dispatch = useAppDispatch();
  const { chanelType = "" } = useParams();
  useEffect(() => {
    (async () => {
      const device = await dispatch(fetchDeviceInfo(deviceInfor)).unwrap();
      await dispatch(fetchCampaignInfo({ token: device.token }));
      dispatch(fetchChanelName(chanelType));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const authToken = localStorage.getItem(StorageKEY.authToken) || "";
      if (authToken) {
        await dispatch(fetchUserInfo(authToken));
      }
    })();
  }, []);

  return <></>;
};
export default AppComponent;
