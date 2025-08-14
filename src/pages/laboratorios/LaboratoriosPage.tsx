import { LaboratoriosProvider} from "./context/LaboratoriosContext";
import LaboratorioForm from "./LaboratorioForm";
import LaboratoriosLst from "./list/LaboratoriosLst";

export default function LaboratoriosPage() {
  return (
    <LaboratoriosProvider>
      <LaboratoriosLst />
      <LaboratorioForm />
    </LaboratoriosProvider>
  )
}
