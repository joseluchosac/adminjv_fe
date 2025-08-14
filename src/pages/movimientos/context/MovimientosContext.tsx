import { createContext, useState } from "react";
import { FilterInfo, FilterParams, Movimientoform } from "../../../app/types";
import { useForm, UseFormReturn } from "react-hook-form";
import { filterInfoInit, filterParamsInit } from "../../../app/utils/constants";

type Modo = {
  vista: "list" | "edit";
  movimientoId: number;
}

export interface MovimientosContextType {
  userMovimientoForm: UseFormReturn<Movimientoform, any, undefined>;
  modo: Modo;
  setModo: React.Dispatch<React.SetStateAction<Modo>>;
  showMovimientosFilterMdl: boolean;
  setShowMovimientosFilterMdl: React.Dispatch<React.SetStateAction<boolean>>;
  filterInfoMovimientos: FilterInfo;
  setFilterInfoMovimientos: React.Dispatch<React.SetStateAction<FilterInfo>>;
  filterParamsMovimientosForm: FilterParams;
  setFilterParamsMovimientosForm: React.Dispatch<React.SetStateAction<FilterParams>>;
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
  const [modo, setModo] = useState<Modo>({vista: "list", movimientoId: 0});
  const [filterInfoMovimientos, setFilterInfoMovimientos] = useState(filterInfoInit);
  const [showMovimientosFilterMdl, setShowMovimientosFilterMdl] = useState(false);
  const [filterParamsMovimientosForm, setFilterParamsMovimientosForm] = useState(filterParamsInit);

  const userMovimientoForm = useForm<Movimientoform>({defaultValues: movimientoFormInit})

  return (
    <MovimientosContext.Provider value={{ 
      userMovimientoForm,
      modo,
      setModo,
      filterInfoMovimientos,
      setFilterInfoMovimientos,
      showMovimientosFilterMdl,
      setShowMovimientosFilterMdl,
      filterParamsMovimientosForm,
      setFilterParamsMovimientosForm,
    }}>
      {children}
    </MovimientosContext.Provider>
  );
};

// Hook personalizado para usar el contexto. se mudo
