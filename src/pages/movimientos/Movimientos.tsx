import { MovimientosProvider } from './context/MovimientosContext'
import Movimientoform from './form/MovimientoForm'
import MovimientosLst from './MovimientosLst'
import MovimientosLstFilterMdl from './MovimientosLstFilterMdl'
import MovimientosLstHead from './MovimientosLstHead'

export default function Movimientos() {
  return (
    <MovimientosProvider>
      <MovimientosLstHead />
      <MovimientosLst />
      <MovimientosLstFilterMdl />
      <Movimientoform />
    </MovimientosProvider>
  )
}
