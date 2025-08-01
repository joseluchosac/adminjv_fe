import { createContext, useContext, useState } from "react";
import { CategoriaOpc, FilterInfo, FilterParams } from "../../../core/types";
import { filterInfoInit, filterParamsInit } from "../../../core/utils/constants";

type Modo = {
  vista: "list" | "edit";
  productoId: number;
}

export interface ProductosContextType {
  modo: Modo;
  setModo: React.Dispatch<React.SetStateAction<Modo>>;
  categoriasOpc: CategoriaOpc[] | null
  setCategoriasOpc: React.Dispatch<React.SetStateAction<CategoriaOpc[] | null>>;
  showProductosFilterMdl: boolean;
  setShowProductosFilterMdl: React.Dispatch<React.SetStateAction<boolean>>;
  filterInfoProductos: FilterInfo;
  setFilterInfoProductos: React.Dispatch<React.SetStateAction<FilterInfo>>;
  filterParamsProductosForm: FilterParams;
  setFilterParamsProductosForm: React.Dispatch<React.SetStateAction<FilterParams>>;
}

// Crear el contexto con un valor por defecto
const ProductosContext = createContext<ProductosContextType | undefined>(undefined);

// Proveedor del contexto
export const ProductosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modo, setModo] = useState<Modo>({vista: "list", productoId: 0});
  const [categoriasOpc, setCategoriasOpc] = useState<CategoriaOpc[] | null>(null);
  const [filterInfoProductos, setFilterInfoProductos] = useState(filterInfoInit);
  const [showProductosFilterMdl, setShowProductosFilterMdl] = useState(false);
  const [filterParamsProductosForm, setFilterParamsProductosForm] = useState(filterParamsInit);

  return (
    <ProductosContext.Provider value={{ 
      modo,
      setModo,
      categoriasOpc,
      setCategoriasOpc,
      showProductosFilterMdl,
      setShowProductosFilterMdl,
      filterInfoProductos,
      setFilterInfoProductos,
      filterParamsProductosForm,
      setFilterParamsProductosForm,
    }}>
      {children}
    </ProductosContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useProductos = () => {
  const context = useContext(ProductosContext);

  if (context === undefined) {
    throw new Error('useProductos must be used within an ProductosProvider');
  }
  return context;
};