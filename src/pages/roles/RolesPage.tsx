import { useEffect, useState } from "react"
import { Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap"
import { Modulo, ApiResp, Rol, ModuloRol } from "../../app/types"
import ModulosRolTree from "./ModulosRolTree"
import { getModulosTree } from "../../app/utils/funciones"
import { useMutateModulosQuery } from "../../api/queries/useModulosQuery"
import DynaIcon from "../../app/components/DynaComponents"
import { LdsBar } from "../../app/components/Loaders"
import Swal from "sweetalert2"
import useLayoutStore from "../../app/store/useLayoutStore"
import { toast } from "react-toastify"
import { useMutateRolesQuery, useRolesQuery } from "../../api/queries/useRolesQuery"

const rolFormInit = {id: 0, rol: ""}

const RolesPage: React.FC = () => {
  const [rolForm, setRolForm] = useState<Rol>(rolFormInit)
  const [modulosRol, setModulosRol] = useState<ModuloRol[] | null>(null)
  const [itemsTree, setItemsTree] = useState<Modulo[] | null>(null)
  const darkMode = useLayoutStore(state => state.layout.darkMode)

  const {
    roles,
    isFetching: isFetchingRoles,
    isLoading: isLoadingRoles,
    isError: isErrorRoles,
  } = useRolesQuery()
  
  const {
    data: getModulosRolResp,
    isPending: isPendingModulosRol,
    getModulosRol
  } = useMutateModulosQuery<ModuloRol[] | ApiResp>()

  const {
    data: mutationModulosRoles, 
    isPending: isPendingMutationModulosRoles,
    updateModulosRoles,
  } = useMutateModulosQuery<ApiResp>()

  const {
    data: mutationRolResp,
    isPending: isPendingMutationRol,
    createRol,
    updateRol,
    deleteRol,
  } = useMutateRolesQuery<ApiResp>()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.currentTarget
    setRolForm({...rolForm, [name]: value})
  }

  const resetForm = () => {
    setRolForm(rolFormInit)
    setModulosRol(null)
    setItemsTree(null)
  }

  const eliminarRol = (rol: Rol) => {
    Swal.fire({
      icon: 'question',
      text: `¿Desea eliminar al rol ${rol.rol}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRol(rol.id)
      }
    });
  }

  const rolToEdit = (id: number) => {
    if(!roles.length) return
    const currentRol = roles.find((el) => el.id === id)
    setRolForm(currentRol!)
    getModulosRol(id)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!rolForm.rol.length){
      toast("Ingrese el rol", {type: "warning"})
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
          updateRol(rolForm)
        }else{
          createRol(rolForm)
        }
      }
    });
  }

  const toggleAssign = (id: Modulo['id']) => {
    if(id == 1 || id == 2) return toast.warning("No es posible cambiar estor módulos")
    if(!modulosRol) return
    const idx = modulosRol?.findIndex((el) => el.id === id)
    modulosRol[idx].assign = !modulosRol[idx].assign
    const newModulosRol = structuredClone(modulosRol)
    setModulosRol(newModulosRol)
    updateModulosRoles({modulo_id: id, rol_id: rolForm.id})
  }

  useEffect(() => {
    if(!modulosRol){
      setItemsTree(null)
    }else{
      setItemsTree(getModulosTree(modulosRol))
    }
  }, [modulosRol])


  useEffect(() => {
    if(!mutationModulosRoles) return
    toast(mutationModulosRoles.msg, {type: mutationModulosRoles.msgType})
  }, [mutationModulosRoles])
  
  useEffect(() => {
    if(!mutationRolResp) return
    if(!mutationRolResp.error){
      resetForm()
    }
    toast(mutationRolResp.msg, {type: mutationRolResp.msgType})
  }, [mutationRolResp])

  useEffect(() => {
    if(!getModulosRolResp) return
    if("error" in getModulosRolResp && getModulosRolResp.error){
      toast(getModulosRolResp.msg || "Hubo un error al obtener los datos", {type: getModulosRolResp.msgType})
      return
    }
    setModulosRol(getModulosRolResp as ModuloRol[])
  }, [getModulosRolResp])

  if(isLoadingRoles){
    return (
      <div className="position-relative">
        <LdsBar />
      </div>
    )
  }

  if(isErrorRoles){
    return <div>Error al obtener los roles</div>
  }

  return (
    <Container style={{maxWidth: "991.98px"}}>
      <Row>
        <Col>
          <Card>
            <Card.Header>ROLES</Card.Header>
            <Card.Body className="position-relative">
              {isPendingMutationRol && isFetchingRoles && <LdsBar />}
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
                  {roles.map((el) => (
                    <tr key={el.id}>
                      <td
                         className={(el.id == rolForm.id) ? "text-info" : ""}
                      >{el.rol}</td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <div role="button"
                            className="text-primary px-2"
                            onClick={() => rolToEdit(el.id)}
                            title="Editar y mostrar módulos"
                            ><DynaIcon name="FaEdit" />
                          </div>
                          <div role="button" 
                            className="text-danger px-2"
                            onClick={()=>eliminarRol(el)}
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
            <Card.Header>PERMISOS {Boolean(rolForm.id) && `PARA:  ${rolForm.rol}`}</Card.Header>
            <Card.Body className="position-relative">
              {isPendingModulosRol && <LdsBar />}
              {isPendingMutationModulosRoles && <LdsBar />}
              {itemsTree ? 
                <Row>
                  <Col>
                    <ModulosRolTree 
                      itemsTree={itemsTree} 
                      setItemsTree={setItemsTree}
                      toggleAssign={toggleAssign}
                    />
                  </Col>
                </Row>
                : <div>Seleccione un rol para asignar sus módulos</div>
              }
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>
  )
}

export default RolesPage