import { Link, useLocation, useNavigate } from "react-router-dom"
import { useTiposComprobanteQuery } from "../../api/queries/useCatalogosQuery"

export default function Lista({show}:{show: boolean}) {
  const location = useLocation()
  const navigate = useNavigate()
  
  const {tiposComprobante} = useTiposComprobanteQuery()

  if(show) return null;
  return (
    <div>
      <button onClick={() => navigate(`${location.pathname}?edit=0`)}>nuevo</button>
      <button onClick={() => navigate(`${location.pathname}?edit=100`)}>otro valor</button>
      <button onClick={() => navigate(`${location.pathname}?view=5`)}>otra variable</button>
      <ul>
        {tiposComprobante.map(el=>{
          return (
            <li key={el.id}>
              <Link to={`${location.pathname}?edit=${el.id}`}>{el.descripcion_doc}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  );
}
