import React from "react";
import { Navigate } from "react-router";
import { authToken } from "../../utils/storageVariables";
interface Props {
  children: JSX.Element;
}
const PrivateRoute: React.FC<Props> = ({ children }) => {
  if (authToken) {
    return children;
  }
  return <Navigate to="/" />;
};

export default PrivateRoute;
