import React, { createContext } from "react";
type AppContextType = [state: any, dispatch: React.Dispatch<any>];
const AppContext = createContext<AppContextType>(["", Function]);
export default AppContext;
