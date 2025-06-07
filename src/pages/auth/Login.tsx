import { Alert, Button, Card, Form, InputGroup } from "react-bootstrap";
import DynaIcon from "../../core/components/DynaComponents";
import { Link } from "react-router-dom";
import { LdsBar } from "../../core/components/Loaders";
import { FormsAuth, LoginForm } from "../../core/types";
import { useMutationUsersQuery } from "../../core/hooks/useUsersQuery";
import useSessionStore from "../../core/store/useSessionStore";
import { useEffect } from "react";

type LoginProps = {
  isPendingEmail: boolean;
  loginForm: LoginForm;
  setLoginForm: (p: LoginForm) => void;
  handleShowForm: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  formsAuth: FormsAuth;
}

const Login: React.FC<LoginProps> = ({
  isPendingEmail, 
  loginForm,
  setLoginForm,
  handleShowForm,
  formsAuth,
}) => {
  
  const {setTknSession, setUserSession, setModulosSesion, setEmpresaSession} = useSessionStore()
  const {
    data: dataSignIn,
    isPending: isPendingSignIn,
    signIn
  } = useMutationUsersQuery()

  const handleSubmitLoginForm = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(loginForm)
  };

  const handleChangeLoginForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setLoginForm({ ...loginForm, [name]: value });
  };
  // const handleChangeCheckLoginForm = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  // };

  useEffect(() => {
    if(dataSignIn && !dataSignIn?.error){
      setTknSession(dataSignIn.content.token)
      setUserSession(dataSignIn.content.registro)
      setModulosSesion(dataSignIn.content.modulosSesion)
      setEmpresaSession(dataSignIn.content.empresaSession)
    }
  }, [dataSignIn])

  return (
    <Card className="login-card mx-auto" >
    <Card.Body>
      { isPendingSignIn && <LdsBar />}
      { isPendingEmail && <LdsBar />}
      <div className="text-center mb-3">
        <h3>LOGIN</h3>
      </div>
      {
        dataSignIn?.error && !isPendingSignIn && 
        <Alert variant="danger" className="p-2 text-wrap text-center">
          {dataSignIn.msg}
        </Alert>
      }
      <Form className="form-login" onSubmit={handleSubmitLoginForm}>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Usuario"
            type="text"
            name="username"
            value={loginForm.username}
            onChange={handleChangeLoginForm}
            autoFocus
          />
          <InputGroup.Text id="basic-addon2"><DynaIcon name="FaUser" /></InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Contraseña"
            type="password"
            name="password"
            value={loginForm.password}
            onChange={handleChangeLoginForm}
          />
          <InputGroup.Text id="basic-addon2"><DynaIcon name="FaLock" /></InputGroup.Text>
        </InputGroup>
        <div className="d-flex justify-content-end align-items-center mb-3">
          <Button variant="primary" type="submit">
            Ingresar
          </Button>
        </div>
      </Form>
      <div>
        <Link to="/register">Registrarse</Link>
      </div>
      <div>
        <a href="#" onClick={handleShowForm} data-form={formsAuth.formOfForgot}>Olvidé mi contraseña</a>
      </div>
    </Card.Body>
  </Card>
  );
};

export default Login;
