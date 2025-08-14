import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { toast } from "react-toastify"
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap"
import { useMutateCategoriasQuery } from "../../api/queries/useCategoriasQuery"
import { flattenTree } from "../../app/utils/funciones"
import CategoriasTree from "./CategoriasTree"
import { LdsBar } from "../../app/components/Loaders"
import useLayoutStore from "../../app/store/useLayoutStore"
import { Categoria, Padre } from "../../app/types"
import { useCategoriasTreeQuery } from "../../api/queries/useCatalogosQuery"
import { useQueryClient } from "@tanstack/react-query"

export const categoriaFormInit = {
  id: 0,
  nombre: "",
  descripcion: "",
  padre_id: 0,
  orden: 0,
  estado: 1
}

export default function CategoriasPage() {
  const [categoriaForm, setCategoriaForm] = useState<Categoria>(categoriaFormInit)
  const [padres, setPadres] = useState<Padre[] | null>(null)
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const queryClient = useQueryClient()
  const {categoriasTree} = useCategoriasTreeQuery()

  const {
    data: mutation, 
    isPending: isPendingMutation, 
    sortCategorias, 
    createCategoria, 
    updateCategoria, 
    deleteCategoria, 
  } = useMutateCategoriasQuery()

  const actualizarPadres = (id: number) => {
    if(!categoriasTree) return
    let nuevosPadres = flattenTree(categoriasTree)
      .filter((el: any)=> el.id != id)
      .map((el: any) => {
        const {id, descripcion, nivel} = el
        return {id, descripcion, nivel}
      }
    )
    setPadres(nuevosPadres)
  }

  const toEdit = (categoria: Categoria) => {
    setCategoriaForm(categoria)
    actualizarPadres(categoria.id)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!categoriaForm.descripcion.trim()){
      toast.warning("Ingrese la descripcion")
      return
    }
    Swal.fire({
      icon: 'question',
      text: '¿Desea guardar el módulo seleccionado?',
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if(categoriaForm.id){
          updateCategoria(categoriaForm)
        }else{
          createCategoria(categoriaForm)
        }
      }
    });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.currentTarget
    setCategoriaForm({...categoriaForm, [name]: value})
  }

  const handleResetForm = () => {
    setCategoriaForm(categoriaFormInit)
    actualizarPadres(0)
  }

  const handleDelete = () => {
    const {id} = categoriaForm
    if(!id){
      toast.warning("Seleccione una categoría de la lista!")
      return
    }
    const item = categoriasTree?.find((el: any) => el.id === id)
    if(item?.children.length){
      toast.warning("No se puede eliminar categorías que tienen hijos")
      return
    }

    Swal.fire({
      icon: 'question',
      text: '¿Desea eliminar la categoría seleccionada?',
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCategoria(id)
      }
    });
  }

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.currentTarget
    setCategoriaForm({...categoriaForm, [name]: value})
  }

  useEffect(() => {
    if(!mutation) return
    if(!mutation?.msgType || !mutation?.msg) return
    toast(mutation.msg, {type: mutation?.msgType})
    if(mutation?.msgType == "success"){
      setCategoriaForm(categoriaFormInit)
    }
    if(mutation.content){
      queryClient.invalidateQueries({queryKey:['categorias_tree']})
    }
  }, [mutation])
    

  useEffect(()=>{
    if(!categoriasTree) return
    actualizarPadres(0)
  }, [categoriasTree])

  return (
    <Container>
      <Row>
        <Col className="mb-3">
          <Card>
            <Card.Header>Categorías</Card.Header>
            <Card.Body className="position-relative">
              {(isPendingMutation) && <LdsBar />}
              <Row>
                <Col>
                  <div className="mb-2"><small>Arrastre los items para ordenar.</small></div>
                  {categoriasTree && categoriasTree && 
                    <CategoriasTree 
                      categoriasTree={categoriasTree} 
                      toEdit={toEdit}
                      sortCategorias={sortCategorias}
                    />
                  }
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col className="mb-3">
          <Card>
            {
              Boolean(categoriaForm.id)
              ? <Card.Header>Edición - {categoriaForm.descripcion}</Card.Header>
              : <Card.Header>Nueva categoría</Card.Header>
            }
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col xl={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Descripción</Form.Label>
                      <Form.Control
                        type="text"
                        name="descripcion"
                        value={categoriaForm.descripcion}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xl={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Padre</Form.Label>
                      <Form.Select 
                        name="padre_id"
                        value={categoriaForm.padre_id}
                        onChange={handleChangeSelect}
                      >
                        <option value={0}> </option>
                        {padres && padres.map((el: Padre) => 
                          <option key={el.id} value={el.id}
                          >
                            {el.descripcion}
                          </option>
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="d-flex justify-content-end gap-2">
                    <Button 
                      variant="secondary" 
                      type="button"
                      onClick={handleResetForm}
                    >Reset</Button>
                    <Button 
                      variant="danger" 
                      type="button"
                      onClick={handleDelete}
                    >Eliminar</Button>
                    <Button variant="primary" type="submit">Guardar</Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
