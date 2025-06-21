import { useSeries } from "./context/SeriesContext"
import { ListGroup } from "react-bootstrap"
import useCatalogosStore from "../../core/store/useCatalogosStore"

export default function SucursalesLst() {
  const {currentSucursalId, setCurrentSucursalId} = useSeries()
  const establecimientos = useCatalogosStore(state=>state.catalogos?.establecimientos)

  const elegirSucursal = (id: number)=>{
    if(id === currentSucursalId) return
    setCurrentSucursalId(id)
  }

  return (
    <div>
      <h5 className="text-center my-2" style={{height:"32px"}}>Sucursales</h5>
      <ListGroup className="mb-3">
        {establecimientos && establecimientos.filter(el=>el.tipo=="sucursal").map((el) => {
          return (
            <ListGroup.Item
              key={el.id}
              action
              active={el.id===currentSucursalId ? true : false}
              onClick={()=>elegirSucursal(el.id)}
            >
              {`${el.codigo} - ${el.descripcion}`}
            </ListGroup.Item>           
          )
        })}
      </ListGroup>
    </div>
  )
}
