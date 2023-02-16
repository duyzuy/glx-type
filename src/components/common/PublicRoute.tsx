import React from "react";
import { isActiveCampaign } from "../../utils/storageVariables";
import { Navigate } from "react-router";
interface Props {
  children: JSX.Element;
}
const PublicRoute: React.FC<Props> = ({ children }) => {
  if (isActiveCampaign) {
    return children;
  }
  return <Navigate to="/expired" replace={true} />;
};
export default PublicRoute;
