import { MarcasProvider} from "./context/MarcasContext";
import MarcasLst from "./lista/MarcasLst";
import MarcaForm from "./MarcaForm";
export default function MarcasPage() {
  return (
    <MarcasProvider>
      <MarcasLst />
      <MarcaForm />
    </MarcasProvider>
  )
}
