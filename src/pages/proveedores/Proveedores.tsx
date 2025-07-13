import ProveedorForm from "./ProveedorForm";
import { ProveedoresProvider} from "./context/ProveedoresContext";
import ProveedoresLst from "./list/ProveedoresLst";

export default function Proveedores() {
  return (
    <ProveedoresProvider>
      <ProveedoresLst />
      <ProveedorForm />
    </ProveedoresProvider>
  )
}