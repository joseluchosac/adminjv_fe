import { MarcasProvider} from "./context/MarcasContext";
import MarcasLst from "./lista/MarcasLst";
import MarcaForm from "./MarcaForm";
export default function Marcas() {
  return (
    <MarcasProvider>
      <MarcasLst />
      <MarcaForm />
    </MarcasProvider>
  )
}
