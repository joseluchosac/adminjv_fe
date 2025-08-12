import { createContext, Dispatch, ReactNode, useContext, useReducer } from "react";
import { UsersActionsType, usersReducer, usersStateInit, UsersStateType } from "../reducers/users-reducer";

export interface UsersContextType {
  stateUsers: UsersStateType;
  dispatchUsers: Dispatch<UsersActionsType>;
}

// Crear el contexto con un valor por defecto
const UsersContext = createContext<UsersContextType | undefined>(undefined);

// Proveedor del contexto
export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stateUsers, dispatchUsers] = useReducer(usersReducer, usersStateInit);
  return (
    <UsersContext.Provider value={{ stateUsers, dispatchUsers}}>
      {children}
    </UsersContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useUsers = () => {

  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within an UsersProvider');
  }
  return context;
};