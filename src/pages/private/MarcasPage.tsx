import { MarcasProvider} from "../../features/marcas/context/MarcasContext";
import MarcasLst from "../../features/marcas/lista/MarcasLst";
import MarcaForm from "../../features/marcas/MarcaForm";
export default function MarcasPage() {
  return (
    <MarcasProvider>
      <MarcasLst />
      <MarcaForm />
    </MarcasProvider>
  )
}
