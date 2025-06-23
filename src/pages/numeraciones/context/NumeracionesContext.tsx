import { createContext, useContext, useState } from "react";

export interface NumeracionesContextType {
  currentEstablecimientoId: number;
  setCurrentEstablecimientoId: React.Dispatch<React.SetStateAction<number>>;
  currentNumeracionId: number;
  setCurrentNumeracionId: React.Dispatch<React.SetStateAction<number>>;
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

// Crear el contexto con un valor por defecto
const NumeracionesContext = createContext<NumeracionesContextType | undefined>(undefined);

// Proveedor del contexto
export const NumeracionesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentEstablecimientoId, setCurrentEstablecimientoId] = useState(0);
  const [currentNumeracionId, setCurrentNumeracionId] = useState(0);
  const [showForm, setShowForm] = useState(false);

  return (
    <NumeracionesContext.Provider value={{ 
      currentEstablecimientoId, 
      setCurrentEstablecimientoId,
      currentNumeracionId, 
      setCurrentNumeracionId,
      showForm, 
      setShowForm,
    }}>
      {children}
    </NumeracionesContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useNumeraciones = () => {

  const context = useContext(NumeracionesContext);
  if (context === undefined) {
    throw new Error('useNumeraciones must be used within an NumeracionesProvider');
  }

  return context;
};