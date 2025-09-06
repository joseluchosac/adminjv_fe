import { createContext } from "react";
import { Movimientoform } from "../../../app/types";
import { useForm, UseFormReturn } from "react-hook-form";

export interface MovimientosContextType {
  movimientoForm: UseFormReturn<Movimientoform, any>;
}

export const movimientoFormInit: Movimientoform = {
  establecimiento_id: 0,
  campo_stock: "",
  tipo: "",
  serie_pre: "M",
  concepto: "",
  destino_id: 0,
  observacion: "",
  detalle: []
}

// Crear el contexto con un valor por defecto
export const MovimientosContext = createContext<MovimientosContextType | undefined>(undefined);

// Proveedor del contexto
export const MovimientosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const movimientoForm = useForm({defaultValues: movimientoFormInit})

  return (
    <MovimientosContext.Provider value={{ 
      movimientoForm,
    }}>
      {children}
    </MovimientosContext.Provider>
  );
};

