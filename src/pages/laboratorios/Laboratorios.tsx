import { LaboratoriosProvider} from "./context/LaboratoriosContext";
import LaboratorioForm from "./LaboratorioForm";
import LaboratoriosLst from "./list/LaboratoriosLst";

export default function Laboratorios() {
  return (
    <LaboratoriosProvider>
      <LaboratoriosLst />
      <LaboratorioForm />
    </LaboratoriosProvider>
  )
}
