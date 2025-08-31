import { useEffect } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useLayoutStore from "../../app/store/useLayoutStore";
import { useMutationUsersQuery } from "../../api/queries/useUsersQuery";
import { ApiResp, GetProfileResp, type Profile, ProfileForm } from "../../app/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LdsEllipsisCenter } from "../../app/components/Loaders";
import { ProfileFormSchema } from "../../app/schemas/users-schema";

export default function ProfilePage() {
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
  } = useForm<ProfileForm>({
    resolver: zodResolver(ProfileFormSchema),
  })

  const {
    data: getProfileResp,
    isPending: isPendingProfile,
    getProfile
  } = useMutationUsersQuery<GetProfileResp>()

  const {
    data: checkPasswordResp,
    checkPassword
  } = useMutationUsersQuery<ApiResp>()

  const {
    data: updateProfileResp,
    isPending: isPendingMutation,
    updateProfile
  } = useMutationUsersQuery<ApiResp>()
  
  const onSubmit = () => {
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
    getProfile()
  }, [])

  useEffect(() => {
    if(!getProfileResp) return
    if("error" in getProfileResp && getProfileResp.error){
      toast(getProfileResp.msg || "Hubo un error al obtener los datos", {type: getProfileResp.msgType})
      return
    }
    reset(getProfileResp as Profile)
  }, [getProfileResp])

  useEffect(() => {
    if(!checkPasswordResp) return
    if(checkPasswordResp.error){
      toast.error(checkPasswordResp.msg)
    }else{
      updateProfile(getValues())
    }
  }, [checkPasswordResp])

  useEffect(() => {
    if(!updateProfileResp) return
    toast(updateProfileResp.msg, {type: updateProfileResp.msgType})
  }, [updateProfileResp])

  
  return (
    <Container>
      <Card>
        <Card.Header>
          <h4>Mis datos</h4>
        </Card.Header>
        <Card.Body className="position-relative">
          {(isPendingProfile || isPendingMutation) && <LdsEllipsisCenter />}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Form.Group as={Col} md={6} xl={4} className="mb-3">
                <Form.Label htmlFor="nombres">Nombres</Form.Label>
                <Form.Control
                  id="nombres"
                  {...register("nombres")}
                />
                {errors.nombres && (
                  <Form.Text className="text-danger">
                    {errors.nombres.message}
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group as={Col} md={6} xl={4} className="mb-3">
                <Form.Label htmlFor="apellidos">Apellidos</Form.Label>
                <Form.Control
                  id="apellidos"
                  {...register("apellidos")}
                />
                {errors.apellidos && (
                  <Form.Text className="text-danger">
                    {errors.apellidos.message}
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group as={Col} md={6} xl={4} className="mb-3">
                <Form.Label htmlFor="username">Usuario</Form.Label>
                <Form.Control
                  disabled
                  id="username"
                  {...register("username")}
                />
              </Form.Group>
              <Form.Group as={Col} md={6} xl={4} className="mb-3">
                <Form.Label htmlFor="email">E-mail</Form.Label>
                <Form.Control
                  id="email"
                  {...register("email")}
                />
                {errors.email && (
                  <Form.Text className="text-danger">
                    {errors.email.message}
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group as={Col} md={6} xl={4} className="mb-3">
                <Form.Label htmlFor="rol">Rol</Form.Label>
                <Form.Control
                  disabled
                  id="rol"
                  {...register("rol")}
                />
              </Form.Group>
              <Form.Group as={Col} md={6} xl={4} className="mb-3">
                <Form.Label htmlFor="caja">Caja</Form.Label>
                <Form.Control
                  disabled
                  id="caja"
                  {...register("caja")}
                />
              </Form.Group>
              <h5 className="mt-3">Cambio de contraseña</h5>
              <hr className="mb-2" />
              <small className="text-muted mb-3">
                Ingrese una nueva contraseña si desea cambiar la actual
              </small>
              <Form.Group as={Col} md={6} xl={4} className="mb-3">
                <Form.Label htmlFor="new_password">Nueva contraseña</Form.Label>
                <Form.Control
                  id="new_password"
                  type="password"
                  {...register("new_password")}
                />
                {errors.new_password && (
                  <Form.Text className="text-danger">
                    {errors.new_password.message}
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group as={Col} md={6} xl={4} className="mb-3">
                <Form.Label htmlFor="confirm_new_password">Confirmar nueva contraseña</Form.Label>
                <Form.Control
                  id="confirm_new_password"
                  type="password"
                  {...register("confirm_new_password")}
                />
                {errors.confirm_new_password && (
                  <Form.Text className="text-danger">
                    {errors.confirm_new_password.message}
                  </Form.Text>
                )}
              </Form.Group>
            </Row>
            <div className="d-flex gap-2 justify-content-end">
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
