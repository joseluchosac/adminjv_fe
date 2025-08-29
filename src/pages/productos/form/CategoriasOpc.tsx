import { useEffect, useState } from "react"
import { useProductos } from "../context/ProductosContext"
import { FaCheckSquare, FaRegSquare } from "react-icons/fa"
import { UseFormGetValues, UseFormSetValue } from "react-hook-form"
import { type CategoriaOpc, ProductoQryRes, Producto, CategoriaTree } from "../../../app/types"
import { Button, Card, Col, Collapse, Form, Row } from "react-bootstrap"
import { useCategoriasQuery, useMutateCategoriasQuery } from "../../../api/queries/useCategoriasQuery"
import { useQueryClient } from "@tanstack/react-query"

type Props = {
  setValue: UseFormSetValue<Producto>;
  getValues: UseFormGetValues<Producto>;
  producto: ProductoQryRes | undefined
}

const nCategoriaInit: CategoriaTree = {
  id: 0,
  descripcion:"",
  padre_id: 0,
  orden: 0,
  nivel: 0,
  children: []
}

export default function CategoriaOpc({setValue, getValues, producto}:Props) {
  const [showNewCategoria, setShowNewCategoria] = useState(false);
  const [nCategoria, setNCategoria] = useState<CategoriaTree>(nCategoriaInit)
  const {
    categoriasOpc,
    setCategoriasOpc,
    modo,
  } = useProductos()
  const queryClient = useQueryClient()
  // const {categoriasTree} = useCategoriasTreeQuery()
  const {categorias} = useCategoriasQuery()

  const seleccionarOpcion = (id: number) => {
    const nuevasCategoriasOpc = categoriasOpc?.map(el=>{
      return (el.id === id) ? {...el, checked: !el.checked} : el
    }) as CategoriaOpc[]
    setCategoriasOpc(nuevasCategoriasOpc)
  }
  
  const {
    data: mutation,
    createCategoria
  } = useMutateCategoriasQuery()
  
  const handleSubmit = ()=>{
    if(!nCategoria.descripcion) return
    createCategoria(nCategoria)
  }

  const resetCategoriasOpc = ()=>{
    if(!categorias.list.length) return
    const resultado: CategoriaOpc[] = categorias.list.map(el=>{
      const {id,descripcion, nivel} = el
      return {id, descripcion, nivel, checked: false}
    })
    setCategoriasOpc(resultado)
  }

  useEffect(()=>{
    if(modo.vista === "list"){
      if(categoriasOpc?.findIndex(el=>el.checked) != -1){
        resetCategoriasOpc()
      }
    }
  },[modo.vista])

  useEffect(()=>{
    resetCategoriasOpc()
  }, [categorias])

  useEffect(()=>{
    if(!producto) return
    const arrCategoriaIds = producto.content?.categoria_ids
    const newCategoriasOpc = categoriasOpc?.map(el=>{
      return {...el, checked: arrCategoriaIds?.includes(el.id)}
    }) as CategoriaOpc[]
    setCategoriasOpc(newCategoriasOpc)
  },[producto])

  useEffect(()=>{
    const ids = categoriasOpc?.filter(el=>el.checked).map(el=>(el.id))
    const {categoria_ids} = getValues()
    if(JSON.stringify(ids) !== JSON.stringify(categoria_ids)){
      setValue("categoria_ids", ids ? ids : [], {shouldDirty: true})
    }
  },[categoriasOpc])

  useEffect(()=>{
    if(!mutation) return
    queryClient.invalidateQueries({queryKey:['categorias_tree']})
    setNCategoria(nCategoriaInit)
  }, [mutation])

  return (
    <Card className="mb-4">
      <Card.Header></Card.Header>
      <Card.Body>
        <Row>
          <Col sm={12} className="mb-3">
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
                    <div className="d-flex align-items-center gap-1 text-nowrap">
                      {el.checked
                        ? <FaCheckSquare className="text-primary flex-shrink-0" />
                        : <FaRegSquare className="text-secondary flex-shrink-0" />
                      }            
                      <div className={el.checked ? "text-primary" : ""}>{el.descripcion}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div 
              role="button" 
              className="text-primary mb-2" 
              onClick={() => setShowNewCategoria(!showNewCategoria)}
            >
              + Agragar categoría
            </div>
            <Collapse in={showNewCategoria}>
              <div>
                <Form.Group as={Col} xl={12} className="mb-2">
                  <Form.Label htmlFor="nueva_categoria">Nombre</Form.Label>
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
                    value={nCategoria.padre_id || ""}
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
              </div>
            </Collapse>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
