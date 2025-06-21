import { SucursalesProvider } from "./context/SucursalesContext"
import SucursalForm from "./SucursalesForm"
import SucursalesHead from "./SucursalesHead"
import SucursalesTbl from "./SucursalesTbl"

export default function Sucursales() {


  return (
    <SucursalesProvider>
      <SucursalesHead />
      <SucursalesTbl />
      <SucursalForm />
    </SucursalesProvider>
  )
}
