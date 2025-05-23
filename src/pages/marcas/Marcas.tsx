import { MarcasProvider} from "./context/MarcasContext";
import MarcaForm from "./MarcaForm";
import MarcasHead from "./MarcasHead";
import MarcasTbl from "./MarcasTbl";
export default function Marcas() {
  return (
    <MarcasProvider>
      <MarcasHead />
      <MarcasTbl />
      <MarcaForm />
    </MarcasProvider>
  )
}
