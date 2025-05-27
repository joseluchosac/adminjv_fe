import Productoform from "./ProductoForm";
import ProductosLstHead from "./ProductosLstHead";
import ProductosLstFilterMdl from "./ProductosLstFilterMdl";
import ProductosLst from "./ProductosLst";
import { useProductos } from "./context/ProductosContext";

export default function Productos() {
  const {mode} = useProductos()
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
