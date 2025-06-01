import Productoform from "./form/ProductoForm";
import ProductosLstHead from "./ProductosLstHead";
import ProductosLstFilterMdl from "./ProductosLstFilterMdl";
import ProductosLst from "./ProductosLst";

export default function Productos() {

  return (
    <>
      <ProductosLstHead/>
      <ProductosLst />
      <Productoform />
      <ProductosLstFilterMdl />
    </>
  );
}
