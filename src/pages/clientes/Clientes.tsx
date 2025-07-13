import ClienteForm from "./ClienteForm";
import { ClientesProvider} from "./context/ClientesContext";
import ClientesLst from "./list/ClientesLst";

export default function Clientes() {
  return (
    <ClientesProvider>
      <ClientesLst />
      <ClienteForm />
    </ClientesProvider>
  )
}