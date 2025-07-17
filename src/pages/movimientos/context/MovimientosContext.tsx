import { createContext, useState } from "react";
import { FilterInfo, Movimiento, Movimientoform } from "../../../core/types";
import { useForm, UseFormReturn } from "react-hook-form";

type Modo = {
  vista: "list" | "edit";
}

const filterMovimientosCurrentInit: FilterInfo = {
  search: "",
  equals: [],
  between: {field_name: "", field_label: "", range: ""},
  orders: [], 
}

export interface MovimientosContextType {
  movimientos: Movimiento[] | null;
  setMovimientos: React.Dispatch<React.SetStateAction<Movimiento[] | null>>;
  userMovimientoForm: UseFormReturn<Movimientoform, any, undefined>
  filterMovimientosCurrent: FilterInfo;
  setFilterMovimientosCurrent: React.Dispatch<React.SetStateAction<FilterInfo>>;
  modo: Modo;
  setModo: React.Dispatch<React.SetStateAction<Modo>>;
  showMovimientosFilterMdl: boolean;
  setShowMovimientosFilterMdl: React.Dispatch<React.SetStateAction<boolean>>;
}

export const movimientoFormInit: Movimientoform = {
  establecimiento_id: 0,
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
  const [movimientos, setMovimientos] = useState<Movimiento[] | null>(null);
  const [modo, setModo] = useState<Modo>({vista: "list"});
  const [filterMovimientosCurrent, setFilterMovimientosCurrent] = useState(filterMovimientosCurrentInit);
  const [showMovimientosFilterMdl, setShowMovimientosFilterMdl] = useState(false);

  const userMovimientoForm = useForm<Movimientoform>({defaultValues: movimientoFormInit})

  return (
    <MovimientosContext.Provider value={{ 
      movimientos, 
      setMovimientos,
      userMovimientoForm,
      modo,
      setModo,
      showMovimientosFilterMdl,
      setShowMovimientosFilterMdl,
      filterMovimientosCurrent,
      setFilterMovimientosCurrent,
    }}>
      {children}
    </MovimientosContext.Provider>
  );
};

// Hook personalizado para usar el contexto. se mudo
