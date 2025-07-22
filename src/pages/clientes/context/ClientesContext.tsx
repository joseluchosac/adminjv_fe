import { createContext, useContext, useState } from "react";
import { FilterInfo, FilterParams } from "../../../core/types";
import { filterInfoInit, filterParamsInit } from "../../../core/utils/constants";

export interface ClientesContextType {
  filterInfoClientes: FilterInfo;
  setFilterInfoClientes: React.Dispatch<React.SetStateAction<FilterInfo>>;
  filterParamsClientesForm: FilterParams;
  setFilterParamsClientesForm: React.Dispatch<React.SetStateAction<FilterParams>>;
}

// Crear el contexto con un valor por defecto
const ClientesContext = createContext<ClientesContextType | undefined>(undefined);

// Proveedor del contexto
export const ClientesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filterInfoClientes, setFilterInfoClientes] = useState(filterInfoInit);
  const [filterParamsClientesForm, setFilterParamsClientesForm] = useState(filterParamsInit);

  return (
    <ClientesContext.Provider value={{
      filterInfoClientes,
      setFilterInfoClientes,
      filterParamsClientesForm,
      setFilterParamsClientesForm,
    }}>
      {children}
    </ClientesContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useClientes = () => {

  const context = useContext(ClientesContext);
  if (context === undefined) {
    throw new Error('useClientes must be used within an ClientesProvider');
  }
  return context;
};