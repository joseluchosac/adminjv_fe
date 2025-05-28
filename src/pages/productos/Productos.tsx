import Productoform from "./ProductoForm";
import ProductosLstHead from "./ProductosLstHead";
import ProductosLstFilterMdl from "./ProductosLstFilterMdl";
import ProductosLst from "./ProductosLst";
import { useProductos } from "./context/ProductosContext";
import { useMutateCategoriasQuery } from "../../core/hooks/useCategoriasQuery";
import { useEffect } from "react";
import { CategoriaProductoOpc } from "../../core/types";

type DataCategorias = {
  data: CategoriaProductoOpc[] | null;
  getCategorias: () => void;
}

export default function Productos() {
  const {mode, setCategoriasProductoOpc} = useProductos()
  const {
    data: categorias, 
    getCategorias
  }: DataCategorias = useMutateCategoriasQuery()

  useEffect(()=>{
    getCategorias()
  },[])
  
  useEffect(()=>{
    if(!categorias) return
    setCategoriasProductoOpc(categorias?.map(el=>{
      const {id, descripcion, padre_id}=el
      return {id, descripcion, padre_id, chked: false}
    }))
  }, [categorias])

  return (
    <>
      <ProductosLstHead/>
      <ProductosLst />
      {
        mode === "edit" && 
        <Productoform />
      }
      <ProductosLstFilterMdl />
    </>
  );
}
