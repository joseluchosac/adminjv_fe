import { useNumeraciones } from "./context/NumeracionesContext"
import { ListGroup } from "react-bootstrap"
import useCatalogosStore from "../../core/store/useCatalogosStore"

export default function EstablecimientosLst() {
  const {currentEstablecimientoId, setCurrentEstablecimientoId} = useNumeraciones()
  const establecimientos = useCatalogosStore(state=>state.catalogos?.establecimientos)

  const elegirEstablecimiento = (id: number)=>{
    if(id === currentEstablecimientoId) return
    setCurrentEstablecimientoId(id)
  }

  return (
    <div>
      <h5 className="text-center my-2" style={{height:"32px"}}>Establecimientos</h5>
      <ListGroup className="mb-3">
        {establecimientos && establecimientos.map((el) => {
          return (
            <ListGroup.Item
              key={el.id}
              action
              active={el.id===currentEstablecimientoId ? true : false}
              onClick={()=>elegirEstablecimiento(el.id)}
            >
              <div>{el.descripcion}</div>
              <small className="text-muted">{`${el.codigo} - ${el.tipo}`}</small>
            </ListGroup.Item>           
          )
        })}
      </ListGroup>
    </div>
  )
}
