import { useEffect } from "react";
import client from "../api/client";
import { StorageKEY } from "../models";
import useDevice from "../hooks/useDevice";
import { fetchDeviceInfo, fetchCampaignInfo } from "./chanel/actions";
import { useAppDispatch } from "../app/hooks";
const AppComponent = () => {
  const deviceInfor = useDevice();
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const device = await dispatch(fetchDeviceInfo(deviceInfor)).unwrap();
      await dispatch(fetchCampaignInfo({ token: device.token }));
    })();
  }, []);

  useEffect(() => {}, []);

  return <></>;
};
export default AppComponent;
