import { createContext, useContext, useState } from "react";
import { FilterInfo } from "../../../../app/types";

const filterEstablecimientosCurrentInit: FilterInfo = {
  search: "",
  equals: [],
  between: {field_name: "", field_label: "", range: ""},
  orders: [], 
}

export interface EstablecimientosContextType {
  showEstablecimientoForm: boolean;
  setShowEstablecimientoForm: React.Dispatch<React.SetStateAction<boolean>>;
  currentEstablecimientoId: number;
  setCurrentEstablecimientoId: React.Dispatch<React.SetStateAction<number>>;
  filterEstablecimientosCurrent: FilterInfo;
  setFilterEstablecimientosCurrent: React.Dispatch<React.SetStateAction<FilterInfo>>;
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