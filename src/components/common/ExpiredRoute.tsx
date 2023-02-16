import React from "react";
import { Navigate } from "react-router";
import { isActiveCampaign } from "../../utils/storageVariables";
interface Props {
  children: JSX.Element;
}
const ExpiredRoute: React.FC<Props> = ({ children }) => {
  if (isActiveCampaign) {
    return <Navigate to="/" replace={true} />;
  }
  return children;
};
export default ExpiredRoute;
