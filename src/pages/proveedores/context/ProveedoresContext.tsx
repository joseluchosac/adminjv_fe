import { createContext, useContext, useState } from "react";
import { FilterInfo, FilterParams } from "../../../core/types";
import { filterInfoInit, filterParamsInit } from "../../../core/utils/constants";

export interface ProveedoresContextType {
  filterInfoProveedores: FilterInfo;
  setFilterInfoProveedores: React.Dispatch<React.SetStateAction<FilterInfo>>;
  filterParamsProveedoresForm: FilterParams;
  setFilterParamsProveedoresForm: React.Dispatch<React.SetStateAction<FilterParams>>;
}

// Crear el contexto con un valor por defecto
const ProveedoresContext = createContext<ProveedoresContextType | undefined>(undefined);

// Proveedor del contexto
export const ProveedoresProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filterInfoProveedores, setFilterInfoProveedores] = useState(filterInfoInit);
  const [filterParamsProveedoresForm, setFilterParamsProveedoresForm] = useState(filterParamsInit);

  return (
    <ProveedoresContext.Provider value={{ 
      filterInfoProveedores,
      setFilterInfoProveedores,
      filterParamsProveedoresForm,
      setFilterParamsProveedoresForm,
    }}>
      {children}
    </ProveedoresContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useProveedores = () => {

  const context = useContext(ProveedoresContext);
  if (context === undefined) {
    throw new Error('useProveedores must be used within an ProveedoresProvider');
  }
  return context;
};