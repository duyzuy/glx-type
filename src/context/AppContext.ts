import React, { createContext } from "react";
type AppContextType = [state: any, dispatch: React.Dispatch<any>];
const AppContext = createContext<AppContextType | []>([]);
export default AppContext;
