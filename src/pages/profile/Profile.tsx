import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Bounce, toast } from "react-toastify";
import Swal from "sweetalert2";
import useSessionStore from "../../core/store/useSessionStore";
import useLayoutStore from "../../core/store/useLayoutStore";
import { Caja, Rol } from "../../core/types/catalogosTypes";
import { useMutationUsersQuery } from "../../core/hooks/useUsersQuery";
import useUserActualFormValidate from "./useUserActualFormValidate";

const profileFormInit = {
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

export default function Profile() {
  const [profileForm, setProfileForm] = useState(profileFormInit)
    const queryClient = useQueryClient()
    const userSession = useSessionStore(state => state.userSession)
    const setUserSession = useSessionStore(state => state.setUserSession)
    const darkMode = useLayoutStore(state => state.layout.darkMode)
    const cajas = queryClient.getQueryData(["cajas"]) as Caja[]
    const roles = queryClient.getQueryData(["roles"]) as Rol[]
  
    const {
      data: profile,
      getProfile
    } = useMutationUsersQuery()

    const {
      data: respCheckPassword,
      checkPassword
    } = useMutationUsersQuery()

    const {
      data: mutation,
      updateProfile
    } = useMutationUsersQuery()
    
  
    const {feedbk, validateErr, validated, setValidated} = useUserActualFormValidate(profileForm)
    const wasModify = useRef(false)
  
    const actualizar = () => {
      queryClient.invalidateQueries({queryKey:["check_auth"]})
    }
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      wasModify.current = true
      const {name, value} = e.currentTarget
      if(!profileForm) return
      setProfileForm({ ...profileForm, [name]: value });
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
      getProfile(userSession.id)
    }, [])
  
    useEffect(() => {
      if(!profile) return
      if(profile.error) return
      const newForm = {...profileForm, ...profile.content}
      setUserSession(profile.content)
      setProfileForm(newForm)
    }, [profile])
  
    useEffect(() => {
      if(!respCheckPassword) return
      if(respCheckPassword.error){
        toast.error(respCheckPassword.msg, {
          autoClose: 3000,
          transition: Bounce,
        })
      }else{
        updateProfile(profileForm)
      }
    }, [respCheckPassword])
  
    useEffect(() => {
      if(!mutation) return
      toast(mutation.msg, {
        type: mutation.msgType,
        autoClose: 3000,
        transition: Bounce,
      })
      if(!mutation.error){
        setUserSession(mutation.content)
      }
    }, [mutation])
  return (
    <Container>
      <Card>
        <Card.Header>
          <h4>Mis datos</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Form.Group as={Col} md={6} xl={4} className="mb-3">
                <Form.Label htmlFor="nombres">Nombres</Form.Label>
                <Form.Control
                  type="text"
                  name="nombres"
                  id="nombres"
                  value={profileForm?.nombres}
                  onChange={handleChange}
                />
                {validated && feedbk.nombres && <div className="invalid-feedback d-block">{feedbk.nombres}</div>}
              </Form.Group>
              <Form.Group as={Col} md={6} xl={4} className="mb-3">
                <Form.Label htmlFor="apellidos">Apellidos</Form.Label>
                <Form.Control
                  type="text"
                  name="apellidos"
                  id="apellidos"
                  value={profileForm?.apellidos}
                  onChange={handleChange}
                />
                {validated && feedbk.nombres && <div className="invalid-feedback d-block">{feedbk.nombres}</div>}
              </Form.Group>
              <Form.Group as={Col} md={6} xl={4} className="mb-3">
                <Form.Label htmlFor="username">Usuario</Form.Label>
                <Form.Control
                  disabled
                  type="text"
                  name="username"
                  id="username"
                  value={profileForm?.username}
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
                  value={profileForm?.email}
                  onChange={handleChange}
                />
                {validated && feedbk.email && <div className="invalid-feedback d-block">{feedbk.email}</div>}
              </Form.Group>
              <Form.Group as={Col} md={4} xl={3} className="mb-3">
                <Form.Label>Caja</Form.Label>
                <div>{cajas?.find(el=>el.id == profileForm.caja_id)?.descripcion}</div>
              </Form.Group>
              <Form.Group as={Col} md={4} xl={3} className="mb-3">
                <Form.Label>Rol</Form.Label>
                <div>{roles?.find(el=>el.id == profileForm.rol_id)?.rol}</div>
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
                  value={profileForm?.password}
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
                  value={profileForm?.password_repeat}
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
