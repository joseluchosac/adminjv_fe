import { useEffect, useState } from "react";
import { Alert, Button, Card, Form, InputGroup } from "react-bootstrap"
import { LdsBar } from "../../app/components/Loaders"
import DynaIcon from "../../app/components/DynaComponents"
import { FormsAuth, LoginForm, QueryResp } from "../../app/types";
import { useMutationUsersQuery } from "../../api/queries/useUsersQuery";
import { toast } from "react-toastify";

type RecoveryPasswordProps = {
  loginForm: LoginForm;
  email: string;
  handleShowForm: (e:React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  formsAuth: FormsAuth;
}

const RecoveryPassword: React.FC<RecoveryPasswordProps> = ({
  loginForm,
  email,
  handleShowForm,
  formsAuth,
}) => {

  const [restoreForm, setRestoreForm] = useState({code:"", new_password:"", new_confirm_password:""})
  const {
    data: dataRestore,
    isPending: isPendingRestore,
    restorePassword
  } = useMutationUsersQuery<QueryResp>()

  const {
    data: dataSendCode,
    isPending: isPendingSendCode,
    sendCodeRestoration
  } = useMutationUsersQuery<QueryResp>()

  const handleChangeRestoreForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestoreForm({ ...restoreForm, [e.target.name]: e.target.value });
  };

  const handleSendCodeRestoration = () => {
    const params = {email, username: loginForm.username}
    sendCodeRestoration(params)
  }

  const handleRestorePassword = (e: React.FormEvent) => {
    e.preventDefault();
    restorePassword(restoreForm)
  };

  useEffect(() => {
    if(!dataSendCode) return
    toast(dataSendCode.msg, {type: dataSendCode.msgType})
  }, [dataSendCode])

  useEffect(() => {
    if(!dataRestore) return
    toast(dataRestore.msg, {type: dataRestore.msgType})
  }, [dataRestore])

  return (
    <Card className="forgot-card mx-auto">
    <Card.Body>
      { isPendingSendCode && <LdsBar />}
      { isPendingRestore && <LdsBar />}
      {
        dataSendCode?.msg && !isPendingSendCode && 
        <Alert variant="success" className="p-2 text-wrap text-center">
          {dataSendCode?.msg}
        </Alert>
      }
      <div className="text-center mb-3">
        <h4>Crear nueva contraseña</h4>
      </div>
      <div className="mb-3">
          <div className="text-center mb-2">
            <Button size="sm" onClick={handleSendCodeRestoration}>Enviar código al email</Button>
          </div>
          <p className="text-center mb-2">{email}</p>
      </div>
      <Form className="form-login" onSubmit={handleRestorePassword}>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Código de 6 dígitos"
            type="text"
            name="code"
            value={restoreForm.code}
            onChange={handleChangeRestoreForm}
          />
          <InputGroup.Text id="basic-addon2"><DynaIcon name="LuRectangleEllipsis" /></InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Nueva contraseña"
            type="password"
            name="new_password"
            value={restoreForm.new_password}
            onChange={handleChangeRestoreForm}
          />
          <InputGroup.Text id="basic-addon2"><DynaIcon name="FaLock" /></InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Repetir nueva contraseña"
            type="password"
            name="new_confirm_password"
            value={restoreForm.new_confirm_password}
            onChange={handleChangeRestoreForm}
          />
          <InputGroup.Text id="basic-addon2"><DynaIcon name="FaLock" /></InputGroup.Text>
        </InputGroup>
        <div className="d-flex justify-content-end mb-3">
          <Button variant="primary" type="submit">
            Guardar los cambios
          </Button>
        </div>
      </Form>
      <div>
        <a href="#" onClick={handleShowForm} data-form={formsAuth.formOfLogin}>Login</a>
      </div>
    </Card.Body>
  </Card>
  )
}

export default RecoveryPassword