import { useEffect } from "react";
import { Alert, Button, Card, Form, InputGroup } from "react-bootstrap"
import { LdsBar } from "../../app/components/Loaders"
import DynaIcon from "../../app/components/DynaComponents"
import { QueryResp, RecoveryForm } from "../../app/types";
import { useMutationUsersQuery } from "../../api/queries/useUsersQuery";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { RecoveryFormSchema } from "../../app/schemas/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

const RecoveryPage: React.FC = () => {
  const recovPlain = sessionStorage.getItem("recov") || ""
  const recov = JSON.parse(recovPlain) as {username: string, email: string}
  const {
    register,
    // formState: { errors },
    // handleSubmit,
    // getValues,
  } = useForm<RecoveryForm>({
    resolver: zodResolver(RecoveryFormSchema),
  })

  const {
    data: dataRestore,
    isPending: isPendingRestore,
    // restorePassword
  } = useMutationUsersQuery<QueryResp>()

  const {
    data: dataSendCode,
    isPending: isPendingSendCode,
    // sendCodeRestoration
  } = useMutationUsersQuery<QueryResp>()

  const handleSendCodeRestoration = () => {
    // const params = {email: recov.email, username: recov.username}
    // sendCodeRestoration(params) // Trabajando en ello
  }

  const handleRestorePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // restorePassword(restoreForm)
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
        <p className="text-center mb-2">{recov.username}</p>
      </div>
      <div className="mb-3">
          <div className="text-center mb-2">
            <Button size="sm" onClick={handleSendCodeRestoration}>Enviar código al email</Button>
          </div>
          <p className="text-center mb-2">{recov.email}</p>
      </div>
      <Form className="form-login" onSubmit={handleRestorePassword}>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Código de 6 dígitos"
            type="text"
            {...register("recovery_code")}
          />
          <InputGroup.Text id="basic-addon2"><DynaIcon name="LuRectangleEllipsis" /></InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Nueva contraseña"
            type="password"
            {...register("new_password")}
          />
          <InputGroup.Text id="basic-addon2"><DynaIcon name="FaLock" /></InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Repetir nueva contraseña"
            type="password"
            {...register("confirm_new_password")}
          />
          <InputGroup.Text id="basic-addon2"><DynaIcon name="FaLock" /></InputGroup.Text>
        </InputGroup>
        <div className="d-flex justify-content-end mb-3">
          <Button variant="primary" type="submit">
            Crear
          </Button>
        </div>
      </Form>
      <div>
        <Link to="/signin">Iniciar sesión</Link>
      </div>
    </Card.Body>
  </Card>
  )
}

export default RecoveryPage