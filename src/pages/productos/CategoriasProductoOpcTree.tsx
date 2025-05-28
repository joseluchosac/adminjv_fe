import { useEffect } from "react"
import { CategoriaProductoOpc } from "../../core/types"
import { Form } from "react-bootstrap"
import { useProductos } from "./context/ProductosContext"

type Props = {
  categoriasProductoOpcTree: CategoriaProductoOpc[] | null
}
export default function CategoriasProductoTree({categoriasProductoOpcTree}: Props) {
 const {categoriasProductoOpc, setCategoriasProductoOpc} = useProductos()

  const toggleSelec = (id: number) => {
    if(categoriasProductoOpc){
      setCategoriasProductoOpc(categoriasProductoOpc.map(el=>{
        return el.id === id ? {...el, chked:!el.chked} : el
      }))
    }
    console.log(id)
  }

  useEffect(()=>{
    // console.log(categoriasProductoOpcTree)
  },[categoriasProductoOpcTree])

  return (categoriasProductoOpcTree &&
    <ul style={{paddingInlineStart: "20px"}}>
      {categoriasProductoOpcTree.map(el => (
        <li
          key={el.id}
          data-padre_id={el.padre_id}
          className='list-group-item'
        >
          <div className='d-flex gap-2 mb-1'>
            <Form.Check checked={el.chked} onChange={()=> toggleSelec(el.id)}/>
            <div>{el.descripcion}</div>
            <span  data-id={el.id}></span>
          </div>
            <CategoriasProductoTree categoriasProductoOpcTree={el.children} />
        </li>
      ))}
    </ul>
  )
}
