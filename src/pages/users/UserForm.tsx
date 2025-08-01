import { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { LdsBar, LdsEllipsisCenter } from "../../core/components/Loaders";
import useLayoutStore from "../../core/store/useLayoutStore";
import { useMutationUsersQuery } from "../../core/hooks/useUsersQuery";
import { useUsers } from "./context/UsersContext";
import { QueryResp, User } from "../../core/types";
import { useCajasQuery } from "../../core/hooks/useCatalogosQuery";
import { useRolesQuery } from "../../core/hooks/useRolesQuery";
import { userFormInit } from "../../core/utils/constants";

interface UserQryRes extends QueryResp {
  content: User;
}

export default function Userform(){
  const {
    stateUsers: { showUserForm, currentUserId },
    dispatchUsers
  } = useUsers()
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const {roles} = useRolesQuery()  
  const {cajas} = useCajasQuery()
  const {
    register, 
    formState: {errors, isDirty}, 
    handleSubmit, 
    reset,
    watch,
  } = useForm<User>({defaultValues: userFormInit})
  
  const {
    data: user,
    isPending: isPendingUser,
    isError: isErrorUser,
    getUser
  }= useMutationUsersQuery<UserQryRes>()

  const {
    data: mutation,
    isPending: isPendingMutation,
    createUser, 
    updateUser, 
  } = useMutationUsersQuery<UserQryRes>()
  
  const submit = (data: User) => {
    Swal.fire({
      icon: 'question',
      text: data.id
        ? `¿Desea guardar los cambios de ${data.nombres} ${data.apellidos}?`
        : `¿Desea registrar a ${data.nombres} ${data.apellidos}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      target: document.getElementById('form_users'),
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (data.id){
          updateUser(data)
        }else{
          createUser(data)
        }
      }
    });
  };

  useEffect(() => {
    if(showUserForm){
      if(currentUserId) getUser(currentUserId)
    }else{
      reset(userFormInit)
    }
  }, [showUserForm])

  useEffect(() => {
    if(!user) return
    if(user.error){
      toast.error("Error al obtener los datos")
      dispatchUsers({
        type: 'SET_SHOW_USER_FORM',
        payload: false,
      });
    }else{
      if(user.content) reset(user.content)
    }
  }, [user])

  useEffect(() => {
    if(!isErrorUser) return
    toast.error("Error de conexion")
    dispatchUsers({
      type: 'SET_SHOW_USER_FORM',
      payload: false,
    });
  }, [isErrorUser])

  useEffect(() => {
    if(!mutation) return
    if(!mutation.error) {
      dispatchUsers({
      type: 'SET_SHOW_USER_FORM',
      payload: false,
    });
    };
    toast(mutation.msg, {type: mutation.msgType})
  }, [mutation])

  return (
    <Modal
      show={showUserForm}
      backdrop="static"
      size="lg"
      onHide={()=>
        dispatchUsers({
          type: 'SET_SHOW_USER_FORM',
          payload: false,
        })
      }
    >
      <Modal.Header closeButton>
        <Modal.Title>{currentUserId ? "Editar usuario" : "Nuevo usuario"}</Modal.Title>
      </Modal.Header>
      <Modal.Body> 
        <Form onSubmit={handleSubmit(submit)} id="form_users">
          {isPendingMutation && <LdsBar />}
          <Row>
            <Form.Group as={Col} md={6} xl={4} className="mb-3">
              <Form.Label htmlFor="nombres">Nombres</Form.Label>
              <Form.Control
                id="nombres"
                {...register('nombres', {
                  required: "Los nombres son requeridos",
                  minLength: {value: 3, message:"Se permite mínimo 3 caracteres"},
                  maxLength: {value: 50, message:"Se permite máximo 50 caracteres"}
                })}
              />
              {errors.nombres && 
                <div className="invalid-feedback d-block">{errors.nombres.message}</div>
              }        </Form.Group>
            <Form.Group as={Col} md={6} xl={4} className="mb-3">
              <Form.Label htmlFor="apellidos">Apellidos</Form.Label>
              <Form.Control
                id="apellidos"
                {...register('apellidos', {
                  required:"Los apellidos son requeridos",
                  minLength: {value: 3, message:"Se permite mínimo 3 caracteres"},
                  maxLength: {value: 50, message:"Se permite máximo 50 caracteres"}
                })}
              />
              {errors.apellidos && 
                <div className="invalid-feedback d-block">{errors.apellidos.message}</div>
              }
            </Form.Group>
            <Form.Group as={Col} md={6} xl={4} className="mb-3">
              <Form.Label htmlFor="username">Usuario</Form.Label>
              <Form.Control
                id="username"
                disabled={currentUserId ? true : false}
                {...register('username', {
                  required:"El nombre de usuario es requerido",
                  minLength: {value: 3, message:"Se permite mínimo 3 caracteres"},
                  maxLength: {value: 50, message:"Se permite máximo 50 caracteres"},
                  pattern: {
                    value: /^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü0-9]+$/,
                    message: 'Solo se permiten letras y números sin espacios'
                  }
                })}
              />
              {errors.username && 
                <div className="invalid-feedback d-block">{errors.username.message}</div>
              }
            </Form.Group>
            <Form.Group as={Col} md={6} xl={4} className="mb-3">
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control
                type="text"
                id="email"
                disabled={currentUserId ? true : false}
                {...register('email', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Formato de email no valido'
                  }
                })}
              />
              {errors.email && 
                <div className="invalid-feedback d-block">{errors.email.message}</div>
              }        
            </Form.Group>
            {!Boolean(currentUserId) &&
              <>
                <Form.Group as={Col} md={6} xl={4} className="mb-3">
                  <Form.Label htmlFor="password">Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    id="password"
                    {...register('password', {
                      required: 'La contraseña es obligatoria',
                      pattern: {
                        value: /^[A-Za-z\d@$!%*?&]{6,}$/,
                        message: 'La contraseña debe tener al menos 6 caracteres sin espacios'
                      }
                    })}
                  />
                  {errors.password && 
                    <div className="invalid-feedback d-block">{errors.password.message}</div>
                  } 
                </Form.Group>
                <Form.Group as={Col} md={6} xl={4} className="mb-3">
                  <Form.Label htmlFor="password_repeat">Repetir contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    id="password_repeat"
                    {...register('password_repeat', {
                      validate: (val: string) => {
                        if (watch('password') != val) {
                          return "los passwords no son iguales";
                        }
                      },
                    })}
                  />
                  {errors.password_repeat && 
                    <div className="invalid-feedback d-block">{errors.password_repeat.message}</div>
                  }
                </Form.Group>
              </>
            }

            <Form.Group as={Col} md={4} xl={3} className="mb-3">
              <Form.Label htmlFor="rol_id">Rol</Form.Label>
              <Form.Select
                id="rol_id"
                {...register('rol_id',{valueAsNumber:true})}
              >
                {roles?.map((el) => 
                  <option key={el.id} value={el.id}>{el.rol}</option>
                )}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} md={4} xl={3} className="mb-3">
              <Form.Label htmlFor="caja_id">Caja</Form.Label>
              <Form.Select
                id="caja_id"
                {...register('caja_id',{valueAsNumber:true})}
              >
                {cajas && cajas.map((el) => 
                  <option key={el.id} value={el.id}>{el.descripcion}</option>
                )}
              </Form.Select>
            </Form.Group>
            { Boolean(currentUserId) &&
              <Form.Group as={Col} md={4} xl={3} className="mb-3">
                <Form.Label htmlFor="estado">Estado</Form.Label>
                <Form.Select
                  disabled
                  id="estado"
                  {...register('estado',{valueAsNumber:true})}
                >
                  <option value="0">Deshabilitado</option>
                  <option value="1">Habilitado</option>
                </Form.Select>
              </Form.Group>
            }
          </Row>
          <div className="d-flex gap-2 justify-content-end">
            <Button
              variant="seccondary"
              type="button"
              onClick={()=>
                dispatchUsers({
                  type: 'SET_SHOW_USER_FORM',
                  payload: false,
                })
              }
            >Cerrar</Button>


            <Button 
              variant="primary" 
              type="submit"
              disabled={isPendingMutation ? true : isDirty ? false : true}
            >
              {isPendingMutation &&
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              }
              Guardar
            </Button>
          </div>
          {isPendingUser && <LdsEllipsisCenter/>}
        </Form>
      </Modal.Body>
    </Modal>
  )
}



