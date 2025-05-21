import { MarcasProvider} from "./context/MarcasContext";
import MarcasMenu from "./MarcasMenu";
import MarcasTbl from "./MarcasTbl";
export default function Marcas() {
  return (
    <MarcasProvider>
      <MarcasMenu />
      <MarcasTbl />
    </MarcasProvider>
  )
}
