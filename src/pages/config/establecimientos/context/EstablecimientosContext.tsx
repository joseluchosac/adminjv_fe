import { createContext, useContext, useState } from "react";
import { FilterCurrent } from "../../../../core/types";
import { Establecimiento } from "../../../../core/types/catalogosTypes";

const filterEstablecimientosCurrentInit: FilterCurrent = {
  equals: [],
  between: {field_name: "", field_label: "", range: ""},
  orders: [], 
}

export interface EstablecimientosContextType {
  // establecimientos: Establecimiento[] | null;
  // setEstablecimientos: React.Dispatch<React.SetStateAction<Establecimiento[] | null>>;
  showEstablecimientoForm: boolean;
  setShowEstablecimientoForm: React.Dispatch<React.SetStateAction<boolean>>;
  currentEstablecimientoId: number;
  setCurrentEstablecimientoId: React.Dispatch<React.SetStateAction<number>>;
  filterEstablecimientosCurrent: FilterCurrent;
  setFilterEstablecimientosCurrent: React.Dispatch<React.SetStateAction<FilterCurrent>>;
}

// Crear el contexto con un valor por defecto
const EstablecimientosContext = createContext<EstablecimientosContextType | undefined>(undefined);

// Proveedor del contexto
export const EstablecimientosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const [establecimientos, setEstablecimientos] = useState<Establecimiento[] | null>(null);
  const [showEstablecimientoForm, setShowEstablecimientoForm] = useState(false);
  const [currentEstablecimientoId, setCurrentEstablecimientoId] = useState(0);
  const [filterEstablecimientosCurrent, setFilterEstablecimientosCurrent] = useState(filterEstablecimientosCurrentInit);

  return (
    <EstablecimientosContext.Provider value={{ 
      // establecimientos, 
      // setEstablecimientos, 
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