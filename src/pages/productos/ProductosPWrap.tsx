import { ProductosProvider } from "./context/ProductosContext";
import Productos from "./Productos";
export default function ProductosPWrap() {
  return (
    <ProductosProvider>
      <Productos />
    </ProductosProvider>
  );
}