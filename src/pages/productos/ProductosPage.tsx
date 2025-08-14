import { ProductosProvider } from "./context/ProductosContext";
import Productoform from "./form/ProductoForm";
import ProductosLst from "./list/ProductosLst";

export default function ProductosPage() {

  return (
    <ProductosProvider>
      <ProductosLst />
      <Productoform />
    </ProductosProvider>
  );
}
