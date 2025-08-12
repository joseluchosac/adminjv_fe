import { LaboratoriosProvider} from "../../features/laboratorios/context/LaboratoriosContext";
import LaboratorioForm from "../../features/laboratorios/LaboratorioForm";
import LaboratoriosLst from "../../features/laboratorios/list/LaboratoriosLst";

export default function LaboratoriosPage() {
  return (
    <LaboratoriosProvider>
      <LaboratoriosLst />
      <LaboratorioForm />
    </LaboratoriosProvider>
  )
}
