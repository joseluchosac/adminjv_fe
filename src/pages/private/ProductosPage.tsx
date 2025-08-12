import { ProductosProvider } from "../../features/productos/context/ProductosContext";
import Productoform from "../../features/productos/form/ProductoForm";
import ProductosLst from "../../features/productos/list/ProductosLst";

export default function ProductosPage() {

  return (
    <ProductosProvider>
      <ProductosLst />
      <Productoform />
    </ProductosProvider>
  );
}
