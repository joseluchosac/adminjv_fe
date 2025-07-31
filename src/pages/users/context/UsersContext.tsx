import { createContext, useContext, useState } from "react";
import { FilterParam, InfoFilter } from "../../../core/types";
import { filterParamInit, InfoFilterInit } from "../../../core/utils/constants";

export interface UsersContextType {
  showUserForm: boolean;
  setShowUserForm: React.Dispatch<React.SetStateAction<boolean>>;
  showUsersFilterMdl: boolean;
  setShowUsersFilterMdl: React.Dispatch<React.SetStateAction<boolean>>;
  currentUserId: number;
  setCurrentUserId: React.Dispatch<React.SetStateAction<number>>;
  infoFilterUsers: InfoFilter;
  setInfoFilterUsers: React.Dispatch<React.SetStateAction<InfoFilter>>;
  filterParamsUsersForm: FilterParam;
  setFilterParamsUsersForm: React.Dispatch<React.SetStateAction<FilterParam>>;
}

// Crear el contexto con un valor por defecto
const UsersContext = createContext<UsersContextType | undefined>(undefined);

// Proveedor del contexto
export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showUserForm, setShowUserForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(0);
  const [showUsersFilterMdl, setShowUsersFilterMdl] = useState(false);
  const [infoFilterUsers, setInfoFilterUsers] = useState(InfoFilterInit);
  const [filterParamsUsersForm, setFilterParamsUsersForm] = useState(filterParamInit);
  return (
    <UsersContext.Provider value={{ 
      showUserForm, 
      setShowUserForm,
      showUsersFilterMdl,
      setShowUsersFilterMdl,
      currentUserId,
      setCurrentUserId,
      infoFilterUsers,
      setInfoFilterUsers,
      filterParamsUsersForm,
      setFilterParamsUsersForm,
    }}>
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