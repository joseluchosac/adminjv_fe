import { useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../../core/store/useSessionStore"
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap"
import { useEffect, useRef, useState } from "react"
import type { CajaT } from "../../core/types"
import Swal from "sweetalert2"
import useLayoutStore from "../../core/store/useLayoutStore"
import { Bounce, toast } from "react-toastify"
import { useMutationUsersQuery } from "../../core/hooks/useUsersQuery"
import useUserActualFormValidate from "./useUserActualFormValidate"
import { Rol } from "../../core/types/catalogosTypes"

const userFormInit = {
  id: 0,
  nombres: '',
  apellidos: '',
  username: '',
  email: '',
  rol_id: 0,
  caja_id: 0,
  created_at: '',
  updated_at: '',
  estado: 1,
  password: '',
  password_repeat: '',
}

const User: React.FC = () => {
  const queryClient = useQueryClient()
  const userSession = useSessionStore(state => state.userSession)
  const setUserSession = useSessionStore(state => state.setUserSession)
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const cajas = queryClient.getQueryData(["cajas"]) as CajaT[]
  const roles = queryClient.getQueryData(["roles"]) as Rol[]
  const [userForm, setUserForm] = useState(userFormInit)

  const {
    data: respCheckPassword,
    checkPassword
  } = useMutationUsersQuery()
  const {
    data: respUpdateUserSession,
    updateUserSession
  } = useMutationUsersQuery()
  const {
    data: dataGetUserSession,
    getUserSession
  } = useMutationUsersQuery()

  const {feedbk, validateErr, validated, setValidated} = useUserActualFormValidate(userForm)
  const wasModify = useRef(false)

  const actualizar = () => {
    queryClient.invalidateQueries({queryKey:["check_auth"]})
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    wasModify.current = true
    const {name, value} = e.currentTarget
    if(!userForm) return
    setUserForm({ ...userForm, [name]: value });
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setValidated(true)
    if(validateErr) return
    Swal.fire({
      text: "Ingrese su contraseña para guardar los cambios",
      input: "password",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      },
    }).then((result) => {
      checkPassword(result.value)
    });
  }

  useEffect(() => {
    if(!userSession) return
    getUserSession(userSession.id)
  }, [])

  useEffect(() => {
    if(!dataGetUserSession) return
    if(dataGetUserSession.error) return
    const newForm = {...userForm, ...dataGetUserSession}
    setUserSession(dataGetUserSession)
    setUserForm(newForm)
  }, [dataGetUserSession])

  useEffect(() => {
    if(!respCheckPassword) return
    if(respCheckPassword.error){
      toast.error(respCheckPassword.msg, {
        autoClose: 3000,
        transition: Bounce,
      })
    }else{
      updateUserSession(userForm)
    }
  }, [respCheckPassword])

  useEffect(() => {
    if(!respUpdateUserSession) return
    toast(respUpdateUserSession.msg, {
      type: respUpdateUserSession.msgType,
      autoClose: 3000,
      transition: Bounce,
    })
    if(!respUpdateUserSession.error){
      setUserSession(respUpdateUserSession.registro)
    }
  }, [respUpdateUserSession])

  return (
    <Container>
      <Card>
        <Card.Header>
          <h4>Modificar datos</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Form.Group as={Col} md={6} xl={4} className="mb-3">
                <Form.Label htmlFor="nombres">Nombres</Form.Label>
                <Form.Control
                  disabled
                  type="text"
                  name="nombres"
                  id="nombres"
                  value={userForm?.nombres}
                  onChange={handleChange}
                />
                {/* {validated && feedbk.nombres && <div className="invalid-feedback d-block">{feedbk.nombres}</div>} */}
              </Form.Group>
              <Form.Group as={Col} md={6} xl={4} className="mb-3">
                <Form.Label htmlFor="apellidos">Apellidos</Form.Label>
                <Form.Control
                  disabled
                  type="text"
                  name="apellidos"
                  id="apellidos"
                  value={userForm?.apellidos}
                  onChange={handleChange}
                />
                {/* {validated && feedbk.nombres && <div className="invalid-feedback d-block">{feedbk.nombres}</div>} */}
              </Form.Group>
              <Form.Group as={Col} md={6} xl={4} className="mb-3">
                <Form.Label htmlFor="username">Usuario</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  id="username"
                  value={userForm?.username}
                  onChange={handleChange}
                />
                {validated && feedbk.username && <div className="invalid-feedback d-block">{feedbk.username}</div>}
              </Form.Group>
              <Form.Group as={Col} md={6} xl={4} className="mb-3">
                <Form.Label htmlFor="email">E-mail</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  id="email"
                  value={userForm?.email}
                  onChange={handleChange}
                />
                {validated && feedbk.email && <div className="invalid-feedback d-block">{feedbk.email}</div>}
              </Form.Group>
              <Form.Group as={Col} md={4} xl={3} className="mb-3">
                <Form.Label>Caja</Form.Label>
                <div>{cajas?.find(el=>el.id == userForm.caja_id)?.descripcion}</div>
              </Form.Group>
              <Form.Group as={Col} md={4} xl={3} className="mb-3">
                <Form.Label>Rol</Form.Label>
                <div>{roles?.find(el=>el.id == userForm.rol_id)?.rol}</div>
              </Form.Group>
              <h5 className="mt-3">Cambio de contraseña</h5>
              <hr className="mb-2" />
              <small className="text-muted mb-3">
                Ingrese una nueva contraseña si desea cambiar la actual
              </small>
              <Form.Group as={Col} md={6} xl={4} className="mb-3">
                <Form.Label htmlFor="password">Nueva contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  id="password"
                  value={userForm?.password}
                  onChange={handleChange}
                />
                {validated && feedbk.password && <div className="invalid-feedback d-block">{feedbk.password}</div>}
              </Form.Group>
              <Form.Group as={Col} md={6} xl={4} className="mb-3">
                <Form.Label htmlFor="password_repeat">Repetir nueva contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="password_repeat"
                  id="password_repeat"
                  value={userForm?.password_repeat}
                  onChange={handleChange}
                />
                {validated && feedbk.password_repeat && <div className="invalid-feedback d-block">{feedbk.password_repeat}</div>}
              </Form.Group>
            </Row>
            <div className="d-flex gap-2 justify-content-end">
              <Button
                  variant="secondary" 
                  type="button"
                  onClick={actualizar}
                >
                  Actualizar
                </Button>
                <Button
                  variant="primary" 
                  type="submit"
                  // disabled={isPending ? true : false}
                >
                  Guardar
                </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default User