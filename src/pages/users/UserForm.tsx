import { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Swal from "sweetalert2" ;
import { useUsers } from "./context/UsersContext";
import {zodResolver} from "@hookform/resolvers/zod";
import { ApiGenericResp, ContentValidate, QueryResp, Rol, UserFormSchema } from "../../app/types";
import useLayoutStore from "../../app/store/useLayoutStore";
import { useRolesQuery } from "../../api/queries/useRolesQuery";
import { useCajasQuery } from "../../api/queries/useCatalogosQuery";
import { userFormInit } from "../../app/utils/constants";
import { useMutationUsersQuery } from "../../api/queries/useUsersQuery";
import { LdsBar, LdsEllipsisCenter } from "../../app/components/Loaders";
import { userFormSchema } from "../../app/types/schemas";

interface MutateUser extends QueryResp {
  content: UserFormSchema | ContentValidate | null;
}

type GetUser = UserFormSchema | ApiGenericResp

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
    setError,
    reset,
  } = useForm<UserFormSchema>({
    defaultValues: userFormInit,
    resolver: zodResolver(userFormSchema),
  })
  
  const {
    data: user,
    isPending: isPendingUser,
    isError: isErrorUser,
    getUser
  }= useMutationUsersQuery<GetUser>()

  const {
    data: mutation,
    isPending: isPendingMutation,
    createUser, 
    updateUser, 
  } = useMutationUsersQuery<MutateUser>()
  
  const submit = (data: UserFormSchema) => {
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

  const closeForm = () => {
    dispatchUsers({
      type: 'SET_SHOW_USER_FORM',
      payload: {showUserForm: false, currentUserId: null},
    });
  }

  useEffect(() => {
    if(showUserForm){
      if(currentUserId) getUser(currentUserId)
    }else{
      reset(userFormInit)
    }
  }, [showUserForm])

  useEffect(() => {
    if(!user) return
    if("error" in user && user.error){
      toast(user.msg || "Hubo un error al obtener los datos", {type: user.msgType})
      closeForm();
      return
    }
    reset(user as UserFormSchema)
  }, [user])

  useEffect(() => {
    if(!isErrorUser) return
    toast.error("Error de conexion")
    closeForm();
  }, [isErrorUser])

  useEffect(() => {
    if(!mutation) return
    if(mutation.error) {
      if(mutation?.errorType === "validation" && mutation.content){
         Object.entries(mutation.content as ContentValidate).forEach(([field, messages]) => {
          const f = field as keyof UserFormSchema;
          setError(f, { type: 'server', message: messages.join(', ') });
        });
      }else{
        toast(mutation.msg, {type: mutation.msgType})
      }
    }else{
      toast(mutation.msg, {type: mutation.msgType})
      closeForm();
    };
  }, [mutation])


  return (
    <Modal
      show={showUserForm}
      backdrop="static"
      size="md"
      onHide={()=> closeForm()}
    >
      <Modal.Header closeButton>
        <Modal.Title>{currentUserId ? "Editar usuario" : "Nuevo usuario"}</Modal.Title>
      </Modal.Header>
      <Modal.Body> 
        <Form onSubmit={handleSubmit(submit)} id="form_users">
          {isPendingMutation && <LdsBar />}
          <Row>
            <Form.Group as={Col} md={6} className="mb-3">
              <Form.Label htmlFor="nombres">Nombres</Form.Label>
              <Form.Control
                id="nombres"
                autoFocus
                {...register('nombres')}
              />
              {errors.nombres && <Fdbk msg={errors.nombres?.message} />}
              </Form.Group>
            <Form.Group as={Col} md={6} className="mb-3">
              <Form.Label htmlFor="apellidos">Apellidos</Form.Label>
              <Form.Control
                id="apellidos"
                {...register('apellidos')}
              />
              {errors.apellidos && <Fdbk msg={errors.apellidos?.message} />}
            </Form.Group>
            <Form.Group as={Col} md={6} className="mb-3">
              <Form.Label htmlFor="username">Usuario</Form.Label>
              <Form.Control
                id="username"
                autoComplete="false"
                disabled={currentUserId ? true : false}
                {...register('username')}
              />
              {errors.username && <Fdbk msg={errors.username?.message} />}
            </Form.Group>
            <Form.Group as={Col} md={6} className="mb-3">
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control
                type="text"
                id="email"
                autoComplete="false"
                disabled={currentUserId ? true : false}
                {...register('email')}
              />
              {errors.email && <Fdbk msg={errors.email?.message} />}       
            </Form.Group>
            {!Boolean(currentUserId) &&
              <>
                <Form.Group as={Col} md={6} className="mb-3">
                  <Form.Label htmlFor="password">Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    id="password"
                    {...register('password')}
                  />
                  {errors.password && <Fdbk msg={errors.password?.message} />}
                </Form.Group>
                <Form.Group as={Col} md={6} className="mb-3">
                  <Form.Label htmlFor="confirm_password">Repetir contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    id="confirm_password"
                    {...register('confirm_password')}
                  />
                  {errors.confirm_password && <Fdbk msg={errors.confirm_password?.message} />}
                </Form.Group>
              </>
            }
            <Form.Group as={Col} md={6} className="mb-3">
              <Form.Label htmlFor="rol_id">Rol</Form.Label>
              <Form.Select
                id="rol_id"
                {...register('rol_id',{valueAsNumber:true})}
              >
                <option value="0">-- Seleccione</option>
                {(roles as Rol[])?.map((el) => 
                  <option key={el.id} value={el.id}>{el.rol}</option>
                )}
              </Form.Select>
              {errors.rol_id && <Fdbk msg={errors.rol_id?.message} />}
            </Form.Group>
            <Form.Group as={Col} md={6} className="mb-3">
              <Form.Label htmlFor="caja_id">Caja</Form.Label>
              <Form.Select
                id="caja_id"
                {...register('caja_id',{valueAsNumber:true})}
              >
                <option value="0">-- Seleccione</option>
                {cajas && cajas.map((el) => 
                  <option key={el.id} value={el.id}>{el.descripcion}</option>
                )}
              </Form.Select>
              {errors.caja_id && <Fdbk msg={errors.caja_id?.message} />}
            </Form.Group>
          </Row>
          <div className="d-flex gap-2 justify-content-end">
            <Button
              variant="seccondary"
              type="button"
              onClick={()=>closeForm()}
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

function Fdbk({msg}:{msg:string | undefined}){
  return (
    <div className="invalid-feedback d-block">{msg}</div>
  )
}


