import Modal from "react-bootstrap/Modal";
import useUsersStore from "../../core/store/useUsersStore";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { LdsBar, LdsEllipsisCenter } from "../../core/components/Loaders";
import useLayoutStore from "../../core/store/useLayoutStore";
import { useEffect, useState } from "react";
import { UserFormT } from "../../core/types";
import { useMutationUsersQuery } from "../../core/hooks/useUsersQuery";
import Swal from "sweetalert2";
import { Bounce, toast } from "react-toastify";
import useCatalogosStore from "../../core/store/useCatalogosStore";
import { useForm } from "react-hook-form";
const user_init = {
  id: 0,
  nombres: "",
  apellidos: "",
  username: "",
  password: '',
  email: "",
  rol_id: 2,
  caja_id: 1,
  created_at: '',
  updated_at: '',
  estado: 1,
  password_repeat: '',
}
type Props = {setTitle: (title:string)=>void;}
function FormUser({setTitle}: Props){
  const currentUserId = useUsersStore(state => state.currentUserId)
  const darkMode = useLayoutStore(state => state.layout.darkMode)

  const catalogos = useCatalogosStore(state => state.catalogos)
  const setShowUserFormMdl = useUsersStore(state => state.setShowUserFormMdl)
  const {
    register, 
    formState: {errors, isDirty}, 
    handleSubmit, 
    reset,
    watch,
  } = useForm<UserFormT>({defaultValues: user_init})

  const {
    data: dataGetUser,
    isPending: isPendingGetUser,
    isError: isErrorGetUser,
    getUser
  } = useMutationUsersQuery()

  const {
    data: dataOnMutate,
    isPending: isPendingOnMutate ,
    createUser, 
    updateUser, 
    deleteUser, 
  } = useMutationUsersQuery()
  
  const submit = (data: UserFormT) => {
    Swal.fire({
      icon: 'question',
      text: data.id
        ? `¿Desea guardar los cambios de ${data.nombres} ${data.apellidos}?`
        : `¿Desea registrar a ${data.nombres} ${data.apellidos}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      target: document.getElementById('frm_users'),
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

  const handleDelete = () => {
    Swal.fire({
      icon: 'question',
      text: `¿Desea eliminar a ${watch("nombres")} ${watch("apellidos")}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      target: document.getElementById('frm_users'),
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(currentUserId)
      }
    });
  }

  const handleClose = () => {
    setShowUserFormMdl(false);
  };

  useEffect(() => {
    if(currentUserId){
      getUser((currentUserId))
      setTitle("Editar usuario")
    }else{
      setTitle("Nuevo usuario")
    }

  }, [])
  
  useEffect(() => {
    if(!dataGetUser) return
    if(dataGetUser.error){
      toast.error("Error al obtener los datos", {
        autoClose: 3000,
        transition: Bounce,
      })
      setShowUserFormMdl(false);
    }else{
      if(dataGetUser){
        reset(dataGetUser)
      }
    }
  }, [dataGetUser])

  useEffect(() => {
    if(!isErrorGetUser) return
    toast.error("Error de conexion", {
      autoClose: 3000,
      transition: Bounce,
    })
    setShowUserFormMdl(false);
  }, [isErrorGetUser])

  useEffect(() => {
    if(!dataOnMutate) return
    if(!dataOnMutate.error) setShowUserFormMdl(false);
    toast(dataOnMutate.msg, {
      type: dataOnMutate.msgType,
      autoClose: 3000,
      transition: Bounce,
    })
  }, [dataOnMutate])

  return (
    <Form onSubmit={handleSubmit(submit)} id="frm_users">
      {isPendingOnMutate && <LdsBar />}
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
            {catalogos?.roles.map((el) => 
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
            {catalogos?.cajas.map((el) => 
              <option key={el.id} value={el.id}>{el.descripcion}</option>
            )}
          </Form.Select>
        </Form.Group>
        { Boolean(currentUserId) &&
          <Form.Group as={Col} md={4} xl={3} className="mb-3">
            <Form.Label htmlFor="estado">Estado</Form.Label>
            <Form.Select
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
          onClick={handleClose}
        >Cerrar</Button>

        {Boolean(currentUserId) && 
          <Button
            variant="danger"
            type="button"
            onClick={handleDelete}
            disabled={isPendingOnMutate ? true : false}
          >Eliminar</Button>
        }
        <Button 
          variant="primary" 
          type="submit"
          disabled={isPendingOnMutate ? true : isDirty ? false : true}
        >
          {isPendingOnMutate &&
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
      {isPendingGetUser && <LdsEllipsisCenter/>}
    </Form>
  )
}


// CUERPO DEL MODAL
export default function UserFormMdl() {
  const showUserFormMdl = useUsersStore(state => state.showUserFormMdl)
  const setShowUserFormMdl = useUsersStore(state => state.setShowUserFormMdl)
  const [title, setTitle] = useState("");
  const handleClose = () => {
    setShowUserFormMdl(false);
  };

  return (
      <Modal show={showUserFormMdl} onHide={handleClose} backdrop="static" size="lg" >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body> {showUserFormMdl && <FormUser setTitle={setTitle} />} </Modal.Body>
      </Modal>
  );
}

