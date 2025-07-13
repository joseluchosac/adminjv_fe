import { createContext, useContext, useState } from "react";
import { FilterInfo, FilterParams } from "../../../core/types";
import { filterInfoInit, filterParamsInit } from "../../../core/utils/constants";

export interface UsersContextType {
  showUserForm: boolean;
  setShowUserForm: React.Dispatch<React.SetStateAction<boolean>>;
  showUsersFilterMdl: boolean;
  setShowUsersFilterMdl: React.Dispatch<React.SetStateAction<boolean>>;
  currentUserId: number;
  setCurrentUserId: React.Dispatch<React.SetStateAction<number>>;
  filterInfoUsers: FilterInfo;
  setFilterInfoUsers: React.Dispatch<React.SetStateAction<FilterInfo>>;
  filterParamsUsersForm: FilterParams;
  setFilterParamsUsersForm: React.Dispatch<React.SetStateAction<FilterParams>>;
}

// Crear el contexto con un valor por defecto
const UsersContext = createContext<UsersContextType | undefined>(undefined);

// Proveedor del contexto
export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showUserForm, setShowUserForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(0);
  const [showUsersFilterMdl, setShowUsersFilterMdl] = useState(false);
  const [filterInfoUsers, setFilterInfoUsers] = useState(filterInfoInit);
  const [filterParamsUsersForm, setFilterParamsUsersForm] = useState(filterParamsInit);
  return (
    <UsersContext.Provider value={{ 
      showUserForm, 
      setShowUserForm,
      showUsersFilterMdl,
      setShowUsersFilterMdl,
      currentUserId,
      setCurrentUserId,
      filterInfoUsers,
      setFilterInfoUsers,
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