import React from "react";
import { StorageKEY } from "../../models";
import { Navigate, useMatch } from "react-router";
interface Props {
  children: JSX.Element;
}
const PrivateRoute: React.FC<Props> = ({ children }) => {
  const match = useMatch(":chanelType/checkout");

  const authToken = localStorage.getItem(StorageKEY.authToken);
  const isMatchingPage = ["shopee", "zalo", "vnpay"].includes(
    match?.params.chanelType || ""
  );
  if (authToken && isMatchingPage) {
    return children;
  }
  if (!authToken && isMatchingPage) {
    return <Navigate to={`/${match?.params.chanelType}`} />;
  }
  return <Navigate to="/404" />;
};

export default PrivateRoute;
