import { createContext, useContext, useState } from "react";
import { Marca } from "../../../core/types";

export interface MarcasContextType {
  marcas: Marca[] | null;
  setMarcas: React.Dispatch<React.SetStateAction<Marca[] | null>>;
  showMarcaFrm: boolean;
  setShowMarcaFrm: React.Dispatch<React.SetStateAction<boolean>>;
  currentMarcaId: number;
  setCurrentMarcaId: React.Dispatch<React.SetStateAction<number>>;
}

// Crear el contexto con un valor por defecto
const MarcasContext = createContext<MarcasContextType | undefined>(undefined);

// Proveedor del contexto
export const MarcasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [marcas, setMarcas] = useState<Marca[] | null>(null);
  const [showMarcaFrm, setShowMarcaFrm] = useState(false);
  const [currentMarcaId, setCurrentMarcaId] = useState(0);

  return (
    <MarcasContext.Provider value={{ 
      marcas, 
      setMarcas, 
      showMarcaFrm, 
      setShowMarcaFrm,
      currentMarcaId,
      setCurrentMarcaId
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