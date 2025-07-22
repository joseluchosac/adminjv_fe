import { MovimientosProvider } from './context/MovimientosContext'
import Movimientoform from './form/MovimientoForm'
import MovimientosLst from './list/MovimientosLst'

export default function Movimientos() {
  return (
    <MovimientosProvider>
      <MovimientosLst />
      <Movimientoform />
    </MovimientosProvider>
  )
}
