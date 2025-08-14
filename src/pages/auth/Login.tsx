import { Alert, Button, Card, Form, InputGroup } from "react-bootstrap";
import DynaIcon from "../../app/components/DynaComponents";
import { Link } from "react-router-dom";
import { LdsBar } from "../../app/components/Loaders";
import { EstablecimientoOption, FormControlElement, FormsAuth, LoginForm, QueryResp } from "../../app/types";
import { useMutationUsersQuery } from "../../api/queries/useUsersQuery";
import useSessionStore from "../../app/store/useSessionStore";
import { useEffect } from "react";
import { useMutationEstablecimientosQuery } from "../../api/queries/useEstablecimientosQuery";
import { FaStore } from "react-icons/fa";

interface SignInQryRes extends QueryResp {
  content: any;
}

type LoginProps = {
  isPendingEmail: boolean;
  loginForm: LoginForm;
  setLoginForm: React.Dispatch<React.SetStateAction<LoginForm>>;
  handleShowForm: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  formsAuth: FormsAuth;
}

const Login: React.FC<LoginProps> = ({isPendingEmail,loginForm,setLoginForm,handleShowForm,formsAuth,}) => {
  const {
    setTknSession,
    curEstab,
    setCurEstab,
  } = useSessionStore()

  const {
    data: dataSignIn,
    isPending: isPendingSignIn,
    signIn
  } = useMutationUsersQuery<SignInQryRes>()

  const {
    data: establecimientos,
    getEstablecimientosOptions
  } = useMutationEstablecimientosQuery()

  const handleSubmitLoginForm = (e: React.FormEvent) => {
    e.preventDefault();
    setCurEstab(Number(loginForm.establecimiento_id))
    signIn(loginForm)
  };


  const handleChangeLoginForm = (e: React.ChangeEvent<FormControlElement>) => {
    const {name, value} = e.target
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    getEstablecimientosOptions()
  },[])

  useEffect(() => {
    setLoginForm((prev)=>({...prev, establecimiento_id:curEstab.toString()}))
  },[curEstab])

  useEffect(() => {
    if(dataSignIn && !dataSignIn?.error){
      setTknSession(dataSignIn.content.token)
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
        <InputGroup className="mb-3">
          <Form.Select
            name="establecimiento_id"
            value={loginForm.establecimiento_id}
            onChange={handleChangeLoginForm}
          >
            <option value="">- Establecimiento -</option>
            {establecimientos && establecimientos?.content.map((el: EstablecimientoOption) => (
              <option key={el.id} value={el.id}>{el.descripcion}</option>
            ))}
          </Form.Select>
          <InputGroup.Text id="basic-addon2"><FaStore /></InputGroup.Text>
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
