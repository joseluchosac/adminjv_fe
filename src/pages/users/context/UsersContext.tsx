import { createContext, useContext, useState } from "react";
import { FilterCurrent, User } from "../../../core/types";

const filterUsersCurrentInit: FilterCurrent = {
  equals: [],
  between: {fieldname: "", campo_text: "", range: ""},
  orders: [], 
}

export interface UsersContextType {
  users: User[] | null;
  setUsers: React.Dispatch<React.SetStateAction<User[] | null>>;
  showUserForm: boolean;
  setShowUserForm: React.Dispatch<React.SetStateAction<boolean>>;
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

  return (
    <UsersContext.Provider value={{ 
      users, 
      setUsers, 
      showUserForm, 
      setShowUserForm,
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