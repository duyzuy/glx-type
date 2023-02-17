import { createContext } from "react";
type AppContextType = [] | null;
const AppContext = createContext<AppContextType>(null);
export default AppContext;
