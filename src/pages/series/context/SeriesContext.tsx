import { createContext, useContext, useState } from "react";
import { SerieSucursal } from "../../../core/types/catalogosTypes";

export interface SeriesContextType {
  currentSucursalId: number;
  setCurrentSucursalId: React.Dispatch<React.SetStateAction<number>>;
  seriesSucursal: SerieSucursal[] | null;
  setSeriesSucursal: React.Dispatch<React.SetStateAction<SerieSucursal[] | null>>;
  currentSerieSucursalId: number;
  setCurrentSerieSucursalId: React.Dispatch<React.SetStateAction<number>>;
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

// Crear el contexto con un valor por defecto
const SeriesContext = createContext<SeriesContextType | undefined>(undefined);

// Proveedor del contexto
export const SeriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSucursalId, setCurrentSucursalId] = useState(0);
  const [seriesSucursal, setSeriesSucursal] = useState<SerieSucursal[] | null>(null);
  const [currentSerieSucursalId, setCurrentSerieSucursalId] = useState(0);
  const [showForm, setShowForm] = useState(false);

  return (
    <SeriesContext.Provider value={{ 
      currentSucursalId, 
      setCurrentSucursalId,
      seriesSucursal, 
      setSeriesSucursal,
      currentSerieSucursalId, 
      setCurrentSerieSucursalId,
      showForm, 
      setShowForm,
    }}>
      {children}
    </SeriesContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useSeries = () => {

  const context = useContext(SeriesContext);
  if (context === undefined) {
    throw new Error('useSeries must be used within an SeriesProvider');
  }

  const actualizarSerieSucursal = (serieSucursal: SerieSucursal) => {
    const {seriesSucursal, setSeriesSucursal} = context
    const idx = seriesSucursal?.findIndex(el => el.id === serieSucursal.id) as number
    if(!seriesSucursal) return
    if(idx === -1){ //agregar
        setSeriesSucursal([...seriesSucursal, serieSucursal])
      }else{ // modificar
        const cloneSeriesSucursal = structuredClone(seriesSucursal)
        cloneSeriesSucursal[idx] = serieSucursal
        setSeriesSucursal(cloneSeriesSucursal)
    }
  } 

  const eliminarSerieSucursal = (id: number) => {
    const {seriesSucursal, setSeriesSucursal} = context
    if(!seriesSucursal) return
    const nuevasSeriesSucursales = seriesSucursal.filter(el => el.id !== id)
    setSeriesSucursal(nuevasSeriesSucursales)
  }

  return {...context, actualizarSerieSucursal, eliminarSerieSucursal};
};