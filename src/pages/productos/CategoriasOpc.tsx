import { useEffect, useState } from "react"
import { useProductos } from "./context/ProductosContext"
import { FaCheckSquare, FaRegSquare } from "react-icons/fa"
import { type CategoriaOpc } from "../../core/types/catalogosTypes"
import { UseFormGetValues, UseFormSetValue } from "react-hook-form"
import { Producto } from "../../core/types"
import { Button, Card, Col, Form, Row } from "react-bootstrap"
import { useMutateCategoriasQuery } from "../../core/hooks/useCategoriasQuery"
import useCatalogosStore from "../../core/store/useCatalogosStore"

type Props = {
  setValue: UseFormSetValue<Producto>;
  getValues: UseFormGetValues<Producto>;
}

const nCategoriaInit = {
  id: 0,
  descripcion:"",
  padre_id: 0,
  orden: 0
}

export default function CategoriaOpc({setValue, getValues}:Props) {
  const [nCategoria, setNCategoria] = useState(nCategoriaInit)
  const {categoriasOpc, setCategoriasOpc} = useProductos()
  const setCatalogosCategoriasTree = useCatalogosStore(state => state.setCatalogosCategoriasTree)

  const seleccionarOpcion = (id: number) => {
    const nuevasCategoriasOpc = categoriasOpc?.map(el=>{
      return (el.id === id) ? {...el, checked: !el.checked} : el
    }) as CategoriaOpc[]
    setCategoriasOpc(nuevasCategoriasOpc)
  }
  
  const {
    data: mutated,
    createCategoria
  } = useMutateCategoriasQuery()
  
  const handleSubmit = ()=>{
    if(!nCategoria.descripcion) return
    createCategoria(nCategoria)
  }

  useEffect(()=>{
    const ids = categoriasOpc?.filter(el=>el.checked).map(el=>(el.id))
    const {categoria_ids} = getValues()
    if(JSON.stringify(ids) !== JSON.stringify(categoria_ids)){
      setValue("categoria_ids", ids ? ids : [], {shouldDirty: true})
    }
  },[categoriasOpc])

  useEffect(()=>{
    if(!mutated) return
    setCatalogosCategoriasTree(mutated.content)
    setNCategoria(nCategoriaInit)
  }, [mutated])

  return (
    <Card className="mb-4">
      <Card.Header></Card.Header>
      <Card.Body>
        <Row>
          <Col sm={12} className="mb-2">
          <Form.Label htmlFor="codigo">Categoría</Form.Label>
          <div className="border" style={{height:"10rem", overflow:"auto"}}>
            <ul className="p-2" style={{listStyle:"none"}}>
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
          </Col>
          <Form.Group as={Col} xl={12} className="mb-3">
            <Form.Label htmlFor="nueve_categoria">Nueva categoría</Form.Label>
            <Form.Control
              id="nueva_categoria" 
              size="sm"
              onChange={e=>setNCategoria({...nCategoria, descripcion: e.target.value})}
              value={nCategoria.descripcion}
            />
          </Form.Group>
          <Form.Group as={Col} xl={12} className="mb-3">
            <Form.Label htmlFor="padre">Padre</Form.Label>
            <Form.Select
              id="padre" size="sm"
              onChange={e=>setNCategoria({...nCategoria, padre_id: parseInt(e.target.value)})}
              value={nCategoria.padre_id}
            >
              <option value={0}> Sin padre</option>
              {categoriasOpc?.map((el) => 
                <option key={el.id} value={el.id}>{el.descripcion}</option>
              )}
            </Form.Select>
          </Form.Group>
          <Col className="text-center">
            <Button 
              size="sm" 
              type="button" 
              variant="secondary"
              onClick={handleSubmit}
            >Guardar categoría</Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
