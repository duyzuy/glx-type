import React, { useContext } from "react";
import AppContext from "../context/AppContext";

export const useSelector = (cb: (params?: any) => void) => {
  const [state, _] = useContext(AppContext);

  if (cb !== undefined && typeof cb === "function") {
    return cb(state);
  }

  return state;
};

export const useDispatch: Function = () => {
  const [_, dispatch] = useContext(AppContext);

  return dispatch;
};
