import { SucursalesProvider } from "./context/SucursalesContext"
import SucursalesHead from "./SucursalesHead"

export default function Sucursales() {


  return (
    <SucursalesProvider>
      <SucursalesHead />
    </SucursalesProvider>
  )
}
