import { createContext, useContext, useState } from "react";
import { FilterParam } from "../../../../app/types";

const filterEstablecimientosCurrentInit: FilterParam = {
  per_page: 50,
  search: "",
  equal: [],
  between: [],
  order: [],
}

export interface EstablecimientosContextType {
  showEstablecimientoForm: boolean;
  setShowEstablecimientoForm: React.Dispatch<React.SetStateAction<boolean>>;
  currentEstablecimientoId: number;
  setCurrentEstablecimientoId: React.Dispatch<React.SetStateAction<number>>;
  filterEstablecimientosCurrent: FilterParam;
  setFilterEstablecimientosCurrent: React.Dispatch<React.SetStateAction<FilterParam>>;
}

// Crear el contexto con un valor por defecto
const EstablecimientosContext = createContext<EstablecimientosContextType | undefined>(undefined);

// Proveedor del contexto
export const EstablecimientosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showEstablecimientoForm, setShowEstablecimientoForm] = useState(false);
  const [currentEstablecimientoId, setCurrentEstablecimientoId] = useState(0);
  const [filterEstablecimientosCurrent, setFilterEstablecimientosCurrent] = useState(filterEstablecimientosCurrentInit);

  return (
    <EstablecimientosContext.Provider value={{ 
      showEstablecimientoForm, 
      setShowEstablecimientoForm,
      currentEstablecimientoId,
      setCurrentEstablecimientoId,
      filterEstablecimientosCurrent,
      setFilterEstablecimientosCurrent
    }}>
      {children}
    </EstablecimientosContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useEstablecimientos = () => {
  const context = useContext(EstablecimientosContext);
  if (context === undefined) {
    throw new Error('useEstablecimientos must be used within an EstablecimientosProvider');
  }


  return context;
};