import { createContext, useContext, useState } from "react";
import { FilterCurrent, User } from "../../../core/types";

const filterUsersCurrentInit: FilterCurrent = {
  equals: [],
  between: {field_name: "", field_label: "", range: ""},
  orders: [], 
}

export interface UsersContextType {
  users: User[] | null;
  setUsers: React.Dispatch<React.SetStateAction<User[] | null>>;
  showUserForm: boolean;
  setShowUserForm: React.Dispatch<React.SetStateAction<boolean>>;
  showUsersFilterMdl: boolean;
  setShowUsersFilterMdl: React.Dispatch<React.SetStateAction<boolean>>;
  currentUserId: number;
  setCurrentUserId: React.Dispatch<React.SetStateAction<number>>;
  filterUsersCurrent: FilterCurrent;
  setFilterUsersCurrent: React.Dispatch<React.SetStateAction<FilterCurrent>>;
}

// Crear el contexto con un valor por defecto
const UsersContext = createContext<UsersContextType | undefined>(undefined);

// Proveedor del contexto
export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(0);
  const [filterUsersCurrent, setFilterUsersCurrent] = useState(filterUsersCurrentInit);
  const [showUsersFilterMdl, setShowUsersFilterMdl] = useState(false);

  return (
    <UsersContext.Provider value={{ 
      users, 
      setUsers, 
      showUserForm, 
      setShowUserForm,
      showUsersFilterMdl,
      setShowUsersFilterMdl,
      currentUserId,
      setCurrentUserId,
      filterUsersCurrent,
      setFilterUsersCurrent
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