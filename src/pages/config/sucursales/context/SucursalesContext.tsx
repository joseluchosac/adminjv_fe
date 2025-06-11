import { createContext, useContext, useState } from "react";
import { FilterCurrent } from "../../../../core/types";
import { Sucursal } from "../../../../core/types/catalogosTypes";

const filterSucursalesCurrentInit: FilterCurrent = {
  equals: [],
  between: {field_name: "", field_label: "", range: ""},
  orders: [], 
}

export interface SucursalesContextType {
  sucursales: Sucursal[] | null;
  setSucursales: React.Dispatch<React.SetStateAction<Sucursal[] | null>>;
  showSucursalForm: boolean;
  setShowSucursalForm: React.Dispatch<React.SetStateAction<boolean>>;
  currentSucursalId: number;
  setCurrentSucursalId: React.Dispatch<React.SetStateAction<number>>;
  filterSucursalesCurrent: FilterCurrent;
  setFilterSucursalesCurrent: React.Dispatch<React.SetStateAction<FilterCurrent>>;
}

// Crear el contexto con un valor por defecto
const SucursalesContext = createContext<SucursalesContextType | undefined>(undefined);

// Proveedor del contexto
export const SucursalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sucursales, setSucursales] = useState<Sucursal[] | null>(null);
  const [showSucursalForm, setShowSucursalForm] = useState(false);
  const [currentSucursalId, setCurrentSucursalId] = useState(0);
  const [filterSucursalesCurrent, setFilterSucursalesCurrent] = useState(filterSucursalesCurrentInit);

  return (
    <SucursalesContext.Provider value={{ 
      sucursales, 
      setSucursales, 
      showSucursalForm, 
      setShowSucursalForm,
      currentSucursalId,
      setCurrentSucursalId,
      filterSucursalesCurrent,
      setFilterSucursalesCurrent
    }}>
      {children}
    </SucursalesContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useSucursales = () => {

  const context = useContext(SucursalesContext);
  if (context === undefined) {
    throw new Error('useSucursales must be used within an SucursalesProvider');
  }
  return context;
};