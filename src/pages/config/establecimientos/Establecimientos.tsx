import { EstablecimientosProvider } from "./context/EstablecimientosContext"
import EstablecimientoForm from "./EstablecimientosForm"
import EstablecimientosTbl from "./EstablecimientosTbl"

export default function Establecimientos() {
  return (
    <EstablecimientosProvider>
      <EstablecimientosTbl />
      <EstablecimientoForm />
    </EstablecimientosProvider>
  )
}
