import { MovimientosProvider } from '../../features/movimientos/context/MovimientosContext'
import Movimientoform from '../../features/movimientos/form/MovimientoForm'
import MovimientosLst from '../../features/movimientos/list/MovimientosLst'

export default function MovimientosPage() {
  return (
    <MovimientosProvider>
      <MovimientosLst />
      <Movimientoform />
    </MovimientosProvider>
  )
}
