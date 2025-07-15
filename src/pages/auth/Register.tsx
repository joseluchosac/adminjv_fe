import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import "./auth.css";
import { useMutationUsersQuery } from "../../core/hooks/useUsersQuery";
import { LdsBar } from "../../core/components/Loaders";
import { Link } from "react-router-dom";
import useRegisterFormValidate from "./hooks/useRegisterFormValidate";
import useSessionStore from "../../core/store/useSessionStore";
import { registerFormInit } from "../../core/utils/constants";

const Register: React.FC = () => {
  const [registerForm, setRegisterForm] = useState(registerFormInit);
  const {feedbk, validateErr, validated, setValidated} = useRegisterFormValidate(registerForm)
  const {setTknSession, setModulosSesion} = useSessionStore()

  const {
    data: mutation,
    isPending: isPendingMutation,
    signUp, 
  } = useMutationUsersQuery()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setRegisterForm({ ...registerForm, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidated(true)
    if(validateErr) return
    signUp(registerForm)
    console.log(registerForm)
  };

  useEffect(() => {
    if(mutation && !mutation?.error){
      setTknSession(mutation.content.token)
      setModulosSesion(mutation.content.modulosSesion)
    }
  }, [mutation])
  
  return (
    <Container>
      <Row className="justify-content-center">
        <Col sm={1} lg={2} xl={2}></Col>
        <Col sm={10} lg={7} xl={7}>
          <Card className="register-card mt-3 mt-md-5" >
            <Card.Body>
              { isPendingMutation && <LdsBar />}
              <div className="text-center mb-3">
                <h3>REGISTRO</h3>
              </div>
              {
                mutation?.error && !isPendingMutation && 
                <Alert variant="danger" className="p-2 text-wrap text-center">
                  {mutation.msg}
                </Alert>
              }
              <Form className="form-register" onSubmit={handleSubmit}>
                <Row>
                  <Form.Group as={Col} md={6} className="mb-3">
                    <Form.Label htmlFor="nombres">Nombres</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombres"
                      id="nombres"
                      value={registerForm.nombres}
                      onChange={handleChange}
                    />
                    {validated && feedbk.nombres && <div className="invalid-feedback d-block">{feedbk.nombres}</div>}
                  </Form.Group>
                  <Form.Group as={Col} md={6} className="mb-3">
                    <Form.Label htmlFor="apellidos">Apellidos</Form.Label>
                    <Form.Control
                      type="text"
                      name="apellidos"
                      id="apellidos"
                      value={registerForm.apellidos}
                      onChange={handleChange}
                    />
                    {validated && feedbk.apellidos && <div className="invalid-feedback d-block">{feedbk.apellidos}</div>}
                  </Form.Group>
                  <Form.Group as={Col} md={6} className="mb-3">
                    <Form.Label htmlFor="username">Nombre de usuario</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      id="username"
                      value={registerForm.username}
                      onChange={handleChange}
                    />
                    {validated && feedbk.username && <div className="invalid-feedback d-block">{feedbk.username}</div>}
                  </Form.Group>
                  <Form.Group as={Col} md={6} className="mb-3">
                    <Form.Label htmlFor="email">Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      id="email"
                      value={registerForm.email}
                      onChange={handleChange}
                    />
                    {validated && feedbk.email && <div className="invalid-feedback d-block">{feedbk.email}</div>}
                  </Form.Group>
                  <Form.Group as={Col} md={6} className="mb-3">
                    <Form.Label htmlFor="password">Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      id="password"
                      value={registerForm.password}
                      onChange={handleChange}
                    />
                    {validated && feedbk.password && <div className="invalid-feedback d-block">{feedbk.password}</div>}
                  </Form.Group>
                  <Form.Group as={Col} md={6} className="mb-3">
                    <Form.Label htmlFor="password_repeat">Repetir contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="password_repeat"
                      id="password_repeat"
                      value={registerForm.password_repeat}
                      onChange={handleChange}
                    />
                    {validated && feedbk.password_repeat && <div className="invalid-feedback d-block">{feedbk.password_repeat}</div>}
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
