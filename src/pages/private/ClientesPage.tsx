import ClienteForm from "../../features/clientes/ClienteForm";
import { ClientesProvider} from "../../features/clientes/context/ClientesContext";
import ClientesLst from "../../features/clientes/list/ClientesLst";

export default function ClientesPage() {
  return (
    <ClientesProvider>
      <ClientesLst />
      <ClienteForm />
    </ClientesProvider>
  )
}