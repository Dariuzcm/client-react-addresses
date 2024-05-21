import { createContext, ReactNode, useReducer } from "react";
import { DirectionReducer, initialState } from "./Reducer";
import { ActionType } from "./Actions/Actions";

interface CPContextType {
  state: typeof initialState;
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