import { useEffect, useState } from "react"
import { useMutateCategoriasQuery } from "../../core/hooks/useCategoriasQuery"
import { getCategoriasTree } from "../../core/utils/funciones"
import { Categoria, Padre } from "../../core/types"
import CategoriasTree from "./CategoriasTree"
import { Button, Card, Col, Container, Form, Nav, Row } from "react-bootstrap"
import { LdsBar } from "../../core/components/Loaders"
import DynaIcon from "../../core/components/DynaComponents"
import IconsModal from "../../core/components/IconsModal"
import { Bounce, toast } from "react-toastify"
import Swal from "sweetalert2"
import useLayoutStore from "../../core/store/useLayoutStore"

export const categoriaFormInit = {
  id: 0,
  nombre: "",
  descripcion: "",
  padre_id: 0,
  icon: "FaRegCircle",
  orden: 0,
  estado: 1
}

export default function Categorias() {
  const [categoriasTree, setCategoriasTree] = useState<Categoria[] | null>(null)
  const [categoriaForm, setCategoriaForm] = useState<Categoria>(categoriaFormInit)
  const [padres, setPadres] = useState<Padre[] | null>(null)
  const [showIconsModal, setShowIconsModal] = useState(false);
  const darkMode = useLayoutStore(state => state.layout.darkMode)

  const {
    data: data_getCategorias, 
    isPending: isPending_getCategorias, 
    getCategorias
  } = useMutateCategoriasQuery()

  const {
    data: data_mutate, 
    isPending: isPending_mutate, 
    sortCategorias, 
    createCategoria, 
    updateCategoria, 
    deleteCategoria, 
  } = useMutateCategoriasQuery()

  const actualizarPadres = (id: number) => {
    if(!data_getCategorias) return
    let nuevosPadres = data_getCategorias
      .filter((el: any)=> el.id != id)
      .map((el: any) => {
        const {id, descripcion} = el
        return {id, descripcion}
      }
    )
    setPadres(nuevosPadres)
  }

  const toEdit = (id: number) => {
    const categoriaActual = data_getCategorias?.find((el: Categoria) => el.id === id) as Categoria
    setCategoriaForm(categoriaActual)
    actualizarPadres(id)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!categoriaForm.descripcion.trim()){
      toast.warning("Ingrese la descripcion", {
        autoClose: 3000,
        transition: Bounce,
      })
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
      toast.warning("Seleccione una categoría de la lista!", {
        autoClose: 3000,
        transition: Bounce,
      })
      return
    }
    const item = categoriasTree?.find(el => el.id === id)
    if(item?.children.length){
      toast.warning("No se puede eliminar categorías que tienen hijos", {
        autoClose: 3000,
        transition: Bounce,
      })
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

  const onChooseIcon = (nameIcon: string) => {
    setCategoriaForm({...categoriaForm, icon: nameIcon})
  }

  useEffect(()=>{
    getCategorias()
  },[])

  useEffect(() => {
    if(!data_mutate) return
    if(!data_mutate?.msgType || !data_mutate?.msg) return
    toast(data_mutate.msg, {
      type: data_mutate?.msgType,
      autoClose: 3000,
      transition: Bounce,
    })
    if(data_mutate?.msgType == "success"){
      setCategoriaForm(categoriaFormInit)
    }
    getCategorias()
  }, [data_mutate])
    
  useEffect(()=>{
    if(!data_getCategorias) return
    setCategoriasTree(getCategoriasTree(data_getCategorias))
  }, [data_getCategorias])

  return (
    <Container>
      <Row>
        <Col className="mb-3">
          <Card>
            <Card.Header>Categorías</Card.Header>
            <Card.Body className="position-relative">
              {(isPending_getCategorias || isPending_mutate) && <LdsBar />}
              <Row>
                <Col>
                  <div className="mb-2"><small>Arrastre los items para ordenar.</small></div>
                  {categoriasTree && 
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
                <Row>
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
                        <option value="0"> - Sin padre -</option>
                        {padres && padres.map((el: Padre) => 
                          <option key={el.id} value={el.id}
                          >
                            {el.descripcion}
                          </option>
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xl={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="nombre"
                        value={categoriaForm.nombre}
                        onChange={handleChange}
                        disabled={categoriaForm.nombre == "" && categoriaForm.id != 0}
                      />
                    </Form.Group>
                  </Col>
                  <Col xl={6}>
                    <Form.Group className="mb-3 d-flex gap-3 align-items-center">
                      <div>Icono</div>
                      <Nav.Link href="#" onClick={() => setShowIconsModal(true)}>
                        <DynaIcon name={categoriaForm.icon} />
                      </Nav.Link>
                      
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
      <IconsModal
        show={showIconsModal}
        setShow={setShowIconsModal}
        onChooseIcon={onChooseIcon}
      />
    </Container>
  )
}
