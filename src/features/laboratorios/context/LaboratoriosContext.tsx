import { createContext, useContext, useState } from "react";
import { FilterInfo, FilterParams } from "../../../app/types";
import { filterInfoInit, filterParamsInit } from "../../../app/utils/constants";

export interface LaboratoriosContextType {
  showLaboratorioForm: boolean;
  setShowLaboratorioForm: React.Dispatch<React.SetStateAction<boolean>>;
  currentLaboratorioId: number;
  setCurrentLaboratorioId: React.Dispatch<React.SetStateAction<number>>;
  filterInfoLaboratorios: FilterInfo;
  setFilterInfoLaboratorios: React.Dispatch<React.SetStateAction<FilterInfo>>;
  filterParamsLaboratoriosForm: FilterParams;
  setFilterParamsLaboratoriosForm: React.Dispatch<React.SetStateAction<FilterParams>>;
}

// Crear el contexto con un valor por defecto
const LaboratoriosContext = createContext<LaboratoriosContextType | undefined>(undefined);

// Proveedor del contexto
export const LaboratoriosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showLaboratorioForm, setShowLaboratorioForm] = useState(false);
  const [currentLaboratorioId, setCurrentLaboratorioId] = useState(0);
  const [filterInfoLaboratorios, setFilterInfoLaboratorios] = useState(filterInfoInit);
  const [filterParamsLaboratoriosForm, setFilterParamsLaboratoriosForm] = useState(filterParamsInit);

  return (
    <LaboratoriosContext.Provider value={{ 
      showLaboratorioForm, 
      setShowLaboratorioForm,
      currentLaboratorioId,
      setCurrentLaboratorioId,
      filterInfoLaboratorios,
      setFilterInfoLaboratorios,
      filterParamsLaboratoriosForm,
      setFilterParamsLaboratoriosForm,
    }}>
      {children}
    </LaboratoriosContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useLaboratorios = () => {

  const context = useContext(LaboratoriosContext);
  if (context === undefined) {
    throw new Error('useLaboratorios must be used within an LaboratoriosProvider');
  }
  return context;
};