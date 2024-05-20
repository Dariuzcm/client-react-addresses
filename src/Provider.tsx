import { createContext, ReactNode, useReducer } from "react";
import { CodigoPostalType } from "./lib/types";
import { ActionType, DirectionReducer, initialState } from "./Reducer";

interface CPContextType {
  state: CodigoPostalType;
  dispatch: React.Dispatch<ActionType>;
}

export const CPContext = createContext<CPContextType | undefined>(undefined);

interface CPProviderProps {
  children: ReactNode;
}

export const CodigoPostalProvider: React.FC<CPProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(DirectionReducer, initialState);

  return (
    <CPContext.Provider value={{ state, dispatch }}>
      {children}
    </CPContext.Provider>
  );
};