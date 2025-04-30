import { useEffect, useState } from "react"
import { Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap"
import { ModuloT } from "../../core/types"
import ModulosRolTree from "./ModulosRolTree"
import { getTree } from "../../core/utils/funciones"
import { rolFormInit } from "../../core/types/initials"
import { useMutateModulosQuery } from "../../core/hooks/useModulosQuery"
import DynaIcon from "../../core/components/DynaComponents"
import { LdsBar } from "../../core/components/Loaders"
import Swal from "sweetalert2"
import useLayoutStore from "../../core/store/useLayoutStore"
import useSessionStore from "../../core/store/useSessionStore"
import useCatalogosStore from "../../core/store/useCatalogosStore"
import { Bounce, toast } from "react-toastify"
import { useMutateRolesQuery } from "../../core/hooks/useRolesQuery"
import { Rol } from "../../core/types/catalogosTypes"

const Roles: React.FC = () => {
  const [rolForm, setRolForm] = useState<Rol>(rolFormInit)
  const [modulosRol, setModulosRol] = useState<ModuloT[] | null>(null)
  const [itemsTree, setItemsTree] = useState<ModuloT[] | null>(null)
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const setModulosSesion = useSessionStore(state => state.setModulosSesion)
  const catalogos = useCatalogosStore(state => state.catalogos)
  const registrarRolStore = useCatalogosStore(state => state.registrarRolStore)
  const actualizarRolStore = useCatalogosStore(state => state.actualizarRolStore)
  const eliminarRolStore = useCatalogosStore(state => state.eliminarRolStore)

  const {
    data: dataObtenerModulosSession,
    obtenerModulosSession
  } = useMutateModulosQuery()

  const {
    data: dataObtenerModuloRol,
    isPending: isPendingObtenerModuloRol,
    obtenerModuloRol
  } = useMutateModulosQuery()

  const {
    data: dataActualizarModulosRoles, 
    isPending: isPendingActualizarModulosRoles,
    actualizarModulosRoles,
  } = useMutateModulosQuery()

  const {
    data: dataMutateRol,
    isPending: isPendingMutateRol,
    registrarRol,
    actualizarRol,
    eliminarRol,
  } = useMutateRolesQuery()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.currentTarget
    setRolForm({...rolForm, [name]: value})
  }

  const resetForm = () => {
    setRolForm(rolFormInit)
    setModulosRol(null)
    setItemsTree(null)
  }

  const handleDelete = (e: React.MouseEvent<HTMLDivElement>) => {
    const {rol_id} = e.currentTarget.dataset
    Swal.fire({
      icon: 'question',
      text: `¿Desea eliminar al rol ${rolForm.rol}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarRol({id: rol_id})
      }
    });
  }

  const toEditRol = (e: React.MouseEvent<HTMLDivElement>) => {
    const {rol_id} = e.currentTarget.dataset
    if(rol_id){
      const currentRol = catalogos?.roles?.find((el) => el.id === parseInt(rol_id)) as Rol
      setRolForm(currentRol)
      obtenerModuloRol(Number(rol_id))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!rolForm.rol.length){
      toast("Ingrese el rol", {
        type: "warning",
        autoClose: 3000,
        transition: Bounce,
      })
      return
    }
        Swal.fire({
      icon: 'question',
      text: rolForm.id 
        ? `¿Desea modificar el rol ${rolForm.rol}?`
        : `¿Desea registrar el rol ${rolForm.rol}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if(rolForm.id){
          actualizarRol(rolForm)
        }else{
          registrarRol(rolForm)
        }
      }
    });
  }

  const toggleAssign = (id: number) => {
    if(!modulosRol) return
    const idx = modulosRol?.findIndex((el) => el.id === id)
    modulosRol[idx].assign = !modulosRol[idx].assign
    const newModulosRol = structuredClone(modulosRol)
    setModulosRol(newModulosRol)
  }

  const guardarModulosRoles = () => {
    const newModulosPefilData = modulosRol?.filter((el) => el.assign === true)
      .map((el) => ({modulo_id: el.id}))
    actualizarModulosRoles({rol_id: rolForm.id, modulos: newModulosPefilData})
  }

  useEffect(() => {
    if(!modulosRol){
      setItemsTree(null)
    }else{
      setItemsTree(getTree(modulosRol))
    }
  }, [modulosRol])


  useEffect(() => {
    if(!dataActualizarModulosRoles) return
    toast(dataActualizarModulosRoles.msg, {
      type: dataActualizarModulosRoles.msgType,
      autoClose: 3000,
      transition: Bounce,
    })
    obtenerModulosSession()
  }, [dataActualizarModulosRoles])
  
  useEffect(() => {
    if(!dataMutateRol) return
    toast(dataMutateRol.msg, {
      type: dataMutateRol.msgType,
      autoClose: 3000,
      transition: Bounce,
    })
    if(dataMutateRol.msgType == "success"){
      if(dataMutateRol.accion === "registrar"){
        registrarRolStore(dataMutateRol.rol)
      }else if(dataMutateRol.accion === "actualizar"){
        actualizarRolStore(dataMutateRol.rol)
      }else if(dataMutateRol.accion === "eliminar"){
        eliminarRolStore(dataMutateRol.rol_id)
      }
      resetForm()
    }
    // obtenerModulosSession()
  }, [dataMutateRol])

  useEffect(() => {
    if(!dataObtenerModulosSession) return
    setModulosSesion(dataObtenerModulosSession)
  }, [dataObtenerModulosSession])

  useEffect(() => {
    if(!dataObtenerModuloRol) return
    setModulosRol(dataObtenerModuloRol)
  }, [dataObtenerModuloRol])


  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Header>ROLES</Card.Header>
            <Card.Body className="position-relative">
              {isPendingMutateRol && <LdsBar />}
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <Form.Label>Rol</Form.Label>
                        <div className="d-flex gap-2">
                          <Button 
                            size="sm" 
                            variant="secondary"
                            onClick={resetForm}
                          >Reset</Button>
                          <Button size="sm" type="submit">Guardar</Button>
                        </div>
                      </div>
                      <Form.Control
                        type="text"
                        name="rol"
                        value={rolForm.rol}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Rol</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {catalogos?.roles && catalogos.roles.map((el) => (
                    <tr key={el.id}>
                      <td
                         className={(el.id == rolForm.id) ? "text-info" : ""}
                      >{el.rol}</td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <div role="button"
                            className="text-primary px-2"
                            onClick={toEditRol}
                            data-rol_id={el.id}
                            title="Editar y mostrar módulos"
                            ><DynaIcon name="FaEdit" />
                          </div>
                          <div role="button" 
                            className="text-danger px-2"
                            onClick={handleDelete}
                            data-rol_id={el.id}
                            title="Eliminar"
                          ><DynaIcon name="FaTrash" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header>MÓDULOS {Boolean(rolForm.id) && `PARA:  ${rolForm.rol}`}</Card.Header>
            <Card.Body className="position-relative">
              {isPendingObtenerModuloRol && <LdsBar />}
              {isPendingActualizarModulosRoles && <LdsBar />}
              {itemsTree ? 
                <>
                  <Row className="mb-2">
                    <Col className="d-flex justify-content-center gap-2">
                      <Button onClick={guardarModulosRoles}>Guardar</Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ModulosRolTree 
                        itemsTree={itemsTree} 
                        setItemsTree={setItemsTree}
                        toggleAssign={toggleAssign}
                      />
                    </Col>
                  </Row>
                </>
                : <div>Seleccione un rol para asignar sus módulos</div>
              }
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>
  )
}

export default Roles