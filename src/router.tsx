import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import PublicRoute from "./components/common/PublicRoute";
import PrivateRoute from "./components/common/PrivateRoute";
import ExpiredRoute from "./components/common/ExpiredRoute";
//Pages
import ChanelPage from "./pages/chanel";
import RootElement from "./pages/RootElements";
import CheckoutPage from "./pages/checkout";
import ThankyouPage from "./pages/thankyou";
import ExpiredPage from "./pages/expired";
import NotFoundPage from "./pages/notfound";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={
          <PublicRoute>
            <RootElement />
          </PublicRoute>
        }
      >
        <Route path=":chanelType" element={<ChanelPage />}></Route>
        <Route
          path=":chanelType/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />
        <Route
          path=":chanelType/thankyou"
          element={
            <PrivateRoute>
              <ThankyouPage />
            </PrivateRoute>
          }
        />
      </Route>
      <Route
        path="/expired"
        element={
          <ExpiredRoute>
            <ExpiredPage />
          </ExpiredRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </>
  )
);
export default router;
export { RouterProvider };
