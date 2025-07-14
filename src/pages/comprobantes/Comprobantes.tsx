import { Button } from "react-bootstrap";
import useTablas from "../../core/hooks/useTablas";

export default function Comprobantes() {
  const {rols, isFetching} = useTablas();
  const handleClick = () => {
  }

  return (
    <div>
      <Button onClick={handleClick}>Nuevo Cliente</Button>
            {isFetching && <h4>Cargando...</h4>}
      <ul>
        {rols && rols.map(el=><li key={el.id}>{el.rol}</li>)}

      </ul>
    </div>
  )
}
