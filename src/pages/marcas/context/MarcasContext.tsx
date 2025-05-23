import { createContext, useContext, useState } from "react";
import { FilterCurrent, Marca } from "../../../core/types";

const filterMarcasCurrentInit: FilterCurrent = {
  equals: [],
  between: {fieldname: "", campo_text: "", range: ""},
  orders: [], 
}

export interface MarcasContextType {
  marcas: Marca[] | null;
  setMarcas: React.Dispatch<React.SetStateAction<Marca[] | null>>;
  showMarcaForm: boolean;
  setShowMarcaForm: React.Dispatch<React.SetStateAction<boolean>>;
  currentMarcaId: number;
  setCurrentMarcaId: React.Dispatch<React.SetStateAction<number>>;
  filterMarcasCurrent: FilterCurrent;
  setFilterMarcasCurrent: React.Dispatch<React.SetStateAction<FilterCurrent>>;
}

// Crear el contexto con un valor por defecto
const MarcasContext = createContext<MarcasContextType | undefined>(undefined);

// Proveedor del contexto
export const MarcasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [marcas, setMarcas] = useState<Marca[] | null>(null);
  const [showMarcaForm, setShowMarcaForm] = useState(false);
  const [currentMarcaId, setCurrentMarcaId] = useState(0);
  const [filterMarcasCurrent, setFilterMarcasCurrent] = useState(filterMarcasCurrentInit);

  return (
    <MarcasContext.Provider value={{ 
      marcas, 
      setMarcas, 
      showMarcaForm, 
      setShowMarcaForm,
      currentMarcaId,
      setCurrentMarcaId,
      filterMarcasCurrent,
      setFilterMarcasCurrent
    }}>
      {children}
    </MarcasContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useMarcas = () => {

  const context = useContext(MarcasContext);
  if (context === undefined) {
    throw new Error('useMarcas must be used within an MarcasProvider');
  }
  return context;
};