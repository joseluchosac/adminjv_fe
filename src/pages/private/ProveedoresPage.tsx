import { ProveedoresProvider } from "../../features/proveedores/context/ProveedoresContext";
import ProveedoresLst from "../../features/proveedores/list/ProveedoresLst";
import ProveedorForm from "../../features/proveedores/ProveedorForm";

export default function ProveedoresPage() {
  return (
    <ProveedoresProvider>
      <ProveedoresLst />
      <ProveedorForm />
    </ProveedoresProvider>
  )
}