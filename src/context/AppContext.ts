import { createContext } from "react";
type AppContextType = Array<[]>;
const AppContext = createContext<AppContextType>([]);
export default AppContext;
