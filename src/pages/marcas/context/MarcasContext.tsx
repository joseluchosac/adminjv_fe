import { createContext, useContext, useState } from "react";
import { FilterInfo, FilterParams } from "../../../app/types";
import { filterInfoInit, filterParamsInit } from "../../../app/utils/constants";

export interface MarcasContextType {
  showMarcaForm: boolean;
  setShowMarcaForm: React.Dispatch<React.SetStateAction<boolean>>;
  currentMarcaId: number;
  setCurrentMarcaId: React.Dispatch<React.SetStateAction<number>>;
  filterInfoMarcas: FilterInfo;
  setFilterInfoMarcas: React.Dispatch<React.SetStateAction<FilterInfo>>;
  filterParamsMarcasForm: FilterParams;
  setFilterParamsMarcasForm: React.Dispatch<React.SetStateAction<FilterParams>>;
}

// Crear el contexto con un valor por defecto
const MarcasContext = createContext<MarcasContextType | undefined>(undefined);

// Proveedor del contexto
export const MarcasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showMarcaForm, setShowMarcaForm] = useState(false);
  const [currentMarcaId, setCurrentMarcaId] = useState(0);
  const [filterInfoMarcas, setFilterInfoMarcas] = useState(filterInfoInit);
  const [filterParamsMarcasForm, setFilterParamsMarcasForm] = useState(filterParamsInit);

  return (
    <MarcasContext.Provider value={{ 
      showMarcaForm, 
      setShowMarcaForm,
      currentMarcaId,
      setCurrentMarcaId,
      filterInfoMarcas,
      setFilterInfoMarcas,
      filterParamsMarcasForm,
      setFilterParamsMarcasForm,
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