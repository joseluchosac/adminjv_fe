import { useProductos } from "./context/ProductosContext"
import { FaCheckSquare, FaRegSquare } from "react-icons/fa"
import { type CategoriaOpc } from "../../core/types/catalogosTypes"
import { useEffect } from "react"
import { UseFormSetValue } from "react-hook-form"
import { Producto } from "../../core/types"

type Props = {
  setValue: UseFormSetValue<Producto>
}

export default function CategoriaOpc({setValue}:Props) {
  const {categoriasOpc, setCategoriasOpc} = useProductos()

  const seleccionarOpcion = (id: number) => {
    const nuevasCategoriasOpc = categoriasOpc?.map(el=>{
      return (el.id === id) ? {...el, checked: !el.checked} : el
    }) as CategoriaOpc[]
    setCategoriasOpc(nuevasCategoriasOpc)
  }
  
  useEffect(()=>{
    const ids = categoriasOpc?.filter(el=>el.checked).map(el=>(el.id))
    setValue("categoria_ids", ids ? ids : [], {shouldDirty: true})
  },[categoriasOpc])

  return (
    <div style={{height:"15rem", overflow:"auto"}}>
      <ul style={{listStyle:"none"}} className="p-0">
        {categoriasOpc?.map(el=>(
          <li 
            key={el.id}
            style={{marginLeft:`${el.nivel}rem`}}
            role="button"
            onClick={()=>seleccionarOpcion(el.id)}
          >
            <div className="d-flex align-items-center gap-1">
              {el.checked
                ? <FaCheckSquare className="text-primary" />
                : <FaRegSquare className="text-secondary" />
              }            
              <div className={el.checked ? "text-primary" : ""}>{el.descripcion}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
