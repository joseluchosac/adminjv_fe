import { useEffect, useState } from "react"
import useLayoutStore from "../../core/store/useLayoutStore"
import ModulosTree from "./ModulosTree"
import { Button, Card, Col, Container, Form, Nav, Row } from "react-bootstrap"
import { Padre } from "../../core/types"
import { useMutateModulosQuery } from "../../core/hooks/useModulosQuery"
import { Bounce, toast } from "react-toastify"
import Swal from "sweetalert2"
import useModulos from "./hooks/useModulos"
import { moduloFormInit } from "../../core/types/initials"
import DynaIcon from "../../core/components/DynaComponents"
import IconsModal from "../../core/components/IconsModal"
import useSessionStore from "../../core/store/useSessionStore"
import { LdsBar } from "../../core/components/Loaders"

const Modulos:React.FC = () => {
  const [showIconsModal, setShowIconsModal] = useState(false);
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const {
    data: dataOnMutate,
    isPending: isPending_mutate,
    sortModulos, 
    createModulo, 
    updateModulo, 
    deleteModulo, 
  } = useMutateModulosQuery()
  const {
    isPendingGetModulos,
    modulosTree,
    toEdit,
    moduloForm,
    setModuloForm,
    padres,
    actualizarPadres,
    getModulos
  } = useModulos()

  const setModulosSesion = useSessionStore(state => state.setModulosSesion)

  const {
    data: dataGetModulosSession,
    getModulosSession
  } = useMutateModulosQuery()


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.currentTarget
    setModuloForm({...moduloForm, [name]: value})
  }

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.currentTarget
    setModuloForm({...moduloForm, [name]: value})
  }
  
  const onChooseIcon = (nameIcon: string) => {
    setModuloForm({...moduloForm, icon_menu: nameIcon})
  }

  const handleResetForm = () => {
    setModuloForm(moduloFormInit)
    actualizarPadres()
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!moduloForm.descripcion.trim()){
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
        if(moduloForm.id){
          updateModulo(moduloForm)
        }else{
          createModulo(moduloForm)
        }
      }
    });
  }

  const handleDelete = () => {
    const {id} = moduloForm
    if(!id){
      toast.warning("Seleccione un módulo de la lista!", {
        autoClose: 3000,
        transition: Bounce,
      })
      return
    }
    const item = modulosTree?.find(el => el.id === id)
    if(item?.children.length){
      toast.warning("No se puede eliminar módulos que tienen hijos", {
        autoClose: 3000,
        transition: Bounce,
      })
      return
    }

    Swal.fire({
      icon: 'question',
      text: '¿Desea eliminar el módulo seleccionado?',
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteModulo(id)
      }
    });
  }

  useEffect(() => {
    if(!dataOnMutate) return
    if(!dataOnMutate?.msgType || !dataOnMutate?.msg) return
    toast(dataOnMutate.msg, {
      type: dataOnMutate?.msgType,
      autoClose: 3000,
      transition: Bounce,
    })
    if(dataOnMutate?.msgType == "success"){
      setModuloForm(moduloFormInit)
    }
    getModulosSession()
    getModulos()
  }, [dataOnMutate])

  useEffect(() => {
    if(!dataGetModulosSession) return
    setModulosSesion(dataGetModulosSession)
  }, [dataGetModulosSession])


  return (
    <Container>
      <Row>
        <Col className="mb-3">
          <Card>
            <Card.Header>Menú de módulos</Card.Header>
            <Card.Body className="position-relative">
              {(isPendingGetModulos || isPending_mutate) && <LdsBar />}
              <Row>
                <Col>
                  <div className="mb-2"><small>Arrastre los items para ordenar.</small></div>
                  {modulosTree && 
                    <ModulosTree 
                      modulosTree={modulosTree} 
                      toEdit={toEdit}
                      sortModulos={sortModulos}
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
              Boolean(moduloForm.id)
              ? <Card.Header>Edición - {moduloForm.descripcion}</Card.Header>
              : <Card.Header>Nuevo módulo</Card.Header>
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
                        value={moduloForm.descripcion}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xl={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Padre</Form.Label>
                      <Form.Select 
                        name="padre_id"
                        value={moduloForm.padre_id}
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
                        value={moduloForm.nombre}
                        onChange={handleChange}
                        disabled={moduloForm.nombre == "" && moduloForm.id != 0}
                      />
                    </Form.Group>
                  </Col>
                  <Col xl={6}>
                    <Form.Group className="mb-3 d-flex gap-3 align-items-center">
                      <div>Icono</div>
                      <Nav.Link href="#" onClick={() => setShowIconsModal(true)}>
                        <DynaIcon name={moduloForm.icon_menu} />
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


export default Modulos