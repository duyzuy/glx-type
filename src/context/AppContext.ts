import { createContext } from "react";
type AppContextType = object;
const AppContext = createContext<AppContextType>({});
export default AppContext;
