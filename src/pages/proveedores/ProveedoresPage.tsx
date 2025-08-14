import { ProveedoresProvider } from "./context/ProveedoresContext";
import ProveedoresLst from "./list/ProveedoresLst";
import ProveedorForm from "./ProveedorForm";

export default function ProveedoresPage() {
  return (
    <ProveedoresProvider>
      <ProveedoresLst />
      <ProveedorForm />
    </ProveedoresProvider>
  )
}