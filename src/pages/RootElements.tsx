import { Outlet, useMatch, Navigate } from "react-router";
import NotFoundPage from "./notfound";
const RootElements = () => {
  const match = useMatch("/:chanelType");
  if (match) {
    if (!["shopee", "zalo", "vnpay"].includes(match.params.chanelType || "")) {
      return <NotFoundPage />;
    }
  }
  return (
    <>
      <Outlet />
    </>
  );
};
export default RootElements;
