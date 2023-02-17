import React, { useEffect, useReducer } from "react";
import AppContext from "../context/AppContext";
import useDevice from "../hooks/useDevice";
//import rootReducer, { initialState } from '../reducer/rootReducer';
import client from "../api/client";
import {
  FETCH_DEVICE,
  FETCH_CAMPAIGN_INFOR,
  FETCH_IP_ADDRESS,
  FETCH_SESSION,
} from "../constants/actions";
//import { getIPAddress } from '../api/tracker';

interface Props {
  children?: JSX.Element;
}

const AppProvider: React.FC<Props> = (props) => {
  //const [state, dispatch] = useReducer(rootReducer, initialState);
  const deviceInfor = useDevice();

  useEffect(() => {}, []);

  return <AppContext.Provider value={[]}>{props.children}</AppContext.Provider>;
};

export default AppProvider;
