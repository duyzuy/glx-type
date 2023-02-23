import React from "react";
import ReactDOM from "react-dom/client";
import "semantic-ui-css/semantic.min.css";
import router, { RouterProvider } from "./router";
import "./index.scss";
import store from "./app/store";
import { Provider } from "react-redux";
import AppProvider from "./provider/AppProvider";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  //<AppProvider>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  //</AppProvider>
);
