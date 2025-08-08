import { useEffect } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "../../assets/css/auth.css";
import { useMutationUsersQuery } from "../../core/hooks/useUsersQuery";
import { LdsEllipsisCenter } from "../../core/components/Loaders";
import { Link } from "react-router-dom";
import useSessionStore from "../../core/store/useSessionStore";
import { QueryResp, RegisterFormType } from "../../core/types";
import { registerFormSchema } from "../../core/types/schemas";

interface SignUpQryRes extends QueryResp {
  content: any
}

const Register: React.FC = () => {
  const {
    setTknSession,
  } = useSessionStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(registerFormSchema),
  });

  const {
    data: dataSignUp,
    isPending: isPendingMutation,
    signUp, 
  } = useMutationUsersQuery<SignUpQryRes>()

  const onSubmit = (data: RegisterFormType) => {
    signUp(data);
  }


  useEffect(() => {
    if(dataSignUp && !dataSignUp?.error){
      setTknSession(dataSignUp.content.token)
    }
  }, [dataSignUp])
  
  return (
    <Container>
      <Row className="justify-content-center">
        {/* <Col sm={1} lg={2} xl={2}></Col> */}
        <Col sm={10} lg={7} xl={7}>
          <Card className="register-card mt-3 mt-md-5" >
            <Card.Body>
              { isPendingMutation && <LdsEllipsisCenter />}
              <div className="text-center mb-3">
                <h3>REGISTRO</h3>
              </div>
              {
                dataSignUp?.error && !isPendingMutation && 
                <Alert variant="danger" className="p-2 text-wrap text-center">
                  {dataSignUp.msg}
                </Alert>
              }
              <Form className="form-register" onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Form.Group as={Col} md={6} className="mb-3">
                    <Form.Label htmlFor="nombres">Nombres</Form.Label>
                    <Form.Control
                      id="nombres"
                      className={errors.nombres ? "is-invalid" : ""}
                      {...register("nombres")}
                    />
                    { errors.nombres && (
                      <Form.Control.Feedback type="invalid">
                        {errors.nombres.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md={6} className="mb-3">
                    <Form.Label htmlFor="apellidos">Apellidos</Form.Label>
                    <Form.Control
                      id="apellidos"
                      className={errors.apellidos ? "is-invalid" : ""}
                      {...register("apellidos")}
                    />
                    { errors.apellidos && (
                      <Form.Control.Feedback type="invalid">
                        {errors.apellidos.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md={6} className="mb-3">
                    <Form.Label htmlFor="username">Nombre de usuario</Form.Label>
                    <Form.Control
                      id="username"
                      className={errors.username ? "is-invalid" : ""}
                      {...register("username")}
                    />
                    { errors.username && (
                      <Form.Control.Feedback type="invalid">
                        {errors.username.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md={6} className="mb-3">
                    <Form.Label htmlFor="email">Email</Form.Label>
                    <Form.Control
                      id="email"
                      className={errors.email ? "is-invalid" : ""}
                      {...register("email")}
                    />
                    { errors.email && (
                      <Form.Control.Feedback type="invalid">
                        {errors.email.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md={6} className="mb-3">
                    <Form.Label htmlFor="password">Contraseña</Form.Label>
                    <Form.Control
                      id="password"
                      type="password"
                      className={errors.password ? "is-invalid" : ""}
                      {...register("password")}
                    />
                    { errors.password && (
                      <Form.Control.Feedback type="invalid">
                        {errors.password.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md={6} className="mb-3">
                    <Form.Label htmlFor="confirm_password">Confirmar contraseña</Form.Label>
                    <Form.Control
                      id="confirm_password"
                      type="password"
                      className={errors.confirm_password ? "is-invalid" : ""}
                      {...register("confirm_password")}
                    />
                    { errors.confirm_password && (
                      <Form.Control.Feedback type="invalid">
                        {errors.confirm_password.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Row>

                <div className="d-flex justify-content-end mb-3">
                  <Button variant="primary" type="submit">
                    Registrarse
                  </Button>
                </div>
              </Form>
              <div>
                <Link to="/auth">Login</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={1} lg={2} xl={2}></Col>
      </Row>

    </Container>
  );
};

export default Register;
