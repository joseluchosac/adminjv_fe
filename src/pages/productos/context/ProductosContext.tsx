import { createContext, useContext, useState } from "react";
import { CategoriaProductoOpc, FilterCurrent, Producto } from "../../../core/types";

const filterProductosCurrentInit: FilterCurrent = {
  equals: [],
  between: {field_name: "", field_label: "", range: ""},
  orders: [], 
}
type Modes = "list" | "edit"
export interface ProductosContextType {
  productos: Producto[] | null;
  setProductos: React.Dispatch<React.SetStateAction<Producto[] | null>>;
  mode: Modes;
  setMode: React.Dispatch<React.SetStateAction<Modes>>;
  showProductosFilterMdl: boolean;
  setShowProductosFilterMdl: React.Dispatch<React.SetStateAction<boolean>>;
  currentProductoId: number;
  setCurrentProductoId: React.Dispatch<React.SetStateAction<number>>;
  filterProductosCurrent: FilterCurrent;
  setFilterProductosCurrent: React.Dispatch<React.SetStateAction<FilterCurrent>>;
  categoriasProductoOpc: CategoriaProductoOpc[] | null;
  setCategoriasProductoOpc: React.Dispatch<React.SetStateAction<CategoriaProductoOpc[] | null>>;
}

// Crear el contexto con un valor por defecto
const ProductosContext = createContext<ProductosContextType | undefined>(undefined);

// Proveedor del contexto
export const ProductosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productos, setProductos] = useState<Producto[] | null>(null);
  const [mode, setMode] = useState<Modes>("list");
  const [currentProductoId, setCurrentProductoId] = useState(0);
  const [filterProductosCurrent, setFilterProductosCurrent] = useState(filterProductosCurrentInit);
  const [showProductosFilterMdl, setShowProductosFilterMdl] = useState(false);
  const [categoriasProductoOpc, setCategoriasProductoOpc] = useState<CategoriaProductoOpc[] | null>(null);

  return (
    <ProductosContext.Provider value={{ 
      productos, 
      setProductos,
      mode,
      setMode,
      showProductosFilterMdl,
      setShowProductosFilterMdl,
      currentProductoId,
      setCurrentProductoId,
      filterProductosCurrent,
      setFilterProductosCurrent,
      categoriasProductoOpc,
      setCategoriasProductoOpc,
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