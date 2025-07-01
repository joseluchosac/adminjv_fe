import { createContext, useContext, useState } from "react";
import { Numeracion } from "../../../core/types";

export interface NumeracionesContextType {
  numeraciones: Numeracion[] | null
  setNumeraciones: React.Dispatch<React.SetStateAction<Numeracion[] | null>>;
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
  const [numeraciones, setNumeraciones] = useState<Numeracion[] | null>(null);
  const [currentEstablecimientoId, setCurrentEstablecimientoId] = useState(0);
  const [currentNumeracionId, setCurrentNumeracionId] = useState(0);
  const [showForm, setShowForm] = useState(false);

  return (
    <NumeracionesContext.Provider value={{ 
      numeraciones,
      setNumeraciones,
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

  const {numeraciones, setNumeraciones} = context
  const setNumeracion = (numeracion: Numeracion) => {
    if(!numeraciones) return
    const idx = numeraciones.findIndex(el=>el.id === numeracion.id)
    if(idx === -1){ // Agrega
      const nuevasNumeraciones = [...numeraciones, numeracion]
      setNumeraciones(nuevasNumeraciones)
    }else{ // modifica
      const nuevasNumeraciones = [...numeraciones]
      nuevasNumeraciones[idx] = numeracion
      setNumeraciones(nuevasNumeraciones)
    }
  }

  const delNumeracion = (id: number) => {
    if(!numeraciones) return
    const nuevasNumeraciones = numeraciones.filter(el=> el.id !== id)
    setNumeraciones(nuevasNumeraciones)
  }

  return {...context, setNumeracion, delNumeracion};
};