import { createContext, useContext, useEffect, useState } from "react";
import { FilterCurrent, Producto } from "../../../core/types";
import { CategoriaOpc } from "../../../core/types/catalogosTypes";
import useCatalogosStore from "../../../core/store/useCatalogosStore";
import { flattenTree } from "../../../core/utils/funciones";

type Modo = {
  vista: "list" | "edit";
  productoId: number;
}

const filterProductosCurrentInit: FilterCurrent = {
  equals: [],
  between: {field_name: "", field_label: "", range: ""},
  orders: [], 
}

export interface ProductosContextType {
  productos: Producto[] | null;
  setProductos: React.Dispatch<React.SetStateAction<Producto[] | null>>;
  modo: Modo;
  setModo: React.Dispatch<React.SetStateAction<Modo>>;
  categoriasOpc: CategoriaOpc[] | null
  setCategoriasOpc: React.Dispatch<React.SetStateAction<CategoriaOpc[] | null>>;
  showProductosFilterMdl: boolean;
  setShowProductosFilterMdl: React.Dispatch<React.SetStateAction<boolean>>;
  filterProductosCurrent: FilterCurrent;
  setFilterProductosCurrent: React.Dispatch<React.SetStateAction<FilterCurrent>>;
}

// Crear el contexto con un valor por defecto
const ProductosContext = createContext<ProductosContextType | undefined>(undefined);

// Proveedor del contexto
export const ProductosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productos, setProductos] = useState<Producto[] | null>(null);
  const [modo, setModo] = useState<Modo>({vista: "list", productoId: 0});
  const [categoriasOpc, setCategoriasOpc] = useState<CategoriaOpc[] | null>(null);
  const [filterProductosCurrent, setFilterProductosCurrent] = useState(filterProductosCurrentInit);
  const [showProductosFilterMdl, setShowProductosFilterMdl] = useState(false);

  return (
    <ProductosContext.Provider value={{ 
      productos, 
      setProductos,
      modo,
      setModo,
      categoriasOpc,
      setCategoriasOpc,
      showProductosFilterMdl,
      setShowProductosFilterMdl,
      filterProductosCurrent,
      setFilterProductosCurrent,
    }}>
      {children}
    </ProductosContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useProductos = () => {
  const context = useContext(ProductosContext);
  const categoriasTree = useCatalogosStore(state => state.catalogos?.categorias_tree)

  const resetCategoriasOpc = ()=>{
    if(!categoriasTree) return
    const categorias = flattenTree(categoriasTree)
    const resultado: CategoriaOpc[] = categorias.map(el=>{
      const {id,descripcion, nivel} = el
      return {id, descripcion, nivel, checked: false}
    })
    context?.setCategoriasOpc(resultado)
  }

  useEffect(()=>{
    resetCategoriasOpc()
  }, [categoriasTree])

  if (context === undefined) {
    throw new Error('useProductos must be used within an ProductosProvider');
  }
  return {...context, resetCategoriasOpc};
};