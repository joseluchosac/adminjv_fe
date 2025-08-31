import { Button, Card, Form, InputGroup } from "react-bootstrap";
import DynaIcon from "../../app/components/DynaComponents";
import { FaStore } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmpresaInfo, ApiResp, SignInForm, SignInResp } from "../../app/types";
import { useEffect } from "react";
import useSessionStore from "../../app/store/useSessionStore";
import { useMutationUsersQuery } from "../../api/queries/useUsersQuery";
import { toast } from "react-toastify";
import { SignInFormSchema } from "../../app/schemas/auth-schema";
import { LdsBar } from "../../app/components/Loaders";
import { useQueryClient } from "@tanstack/react-query";

interface DataEmailQryRes extends ApiResp {
  email?: string;
}

export default function SignInPage() {
  const { setTknSession, curEstab, setCurEstab } = useSessionStore();
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const {establecimientosOpc} = queryClient.getQueryData(["empresa_info"]) as EmpresaInfo
  
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm<SignInForm>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: { username: "", password: "", establecimiento_id: curEstab }
  })

  const {
    data: signInResp,
    isPending: isPendingSignIn,
    signIn,
  } = useMutationUsersQuery<SignInResp>();

  const {
    data: dataEmail,
    isPending: isPendingEmail,
    getEmailByUsername,
  } = useMutationUsersQuery<DataEmailQryRes>();

  const onSubmit = (data: SignInForm) => {
    signIn(data)
    setCurEstab(Number(data.establecimiento_id));
  }

  const handleRecovery = () => {
    const username = getValues().username
    if(!username) return toast.warning("Ingrese el usuario")
    getEmailByUsername(username)
  }

  useEffect(() => {
    if(!signInResp) return
    if('token' in signInResp){
      setTknSession(signInResp.token as string || "");
    }else if("error" in signInResp && signInResp.error){
      toast(signInResp.msg || "Hubo un error al obtener los datos", {type: signInResp.msgType})
    }
  }, [signInResp]);

  useEffect(()=>{
    if(!dataEmail) return
    if(dataEmail.error){
      toast.warning(dataEmail.msg)
    }else{
      const recov = {username: getValues().username, email: dataEmail.email || ""}
      sessionStorage.setItem("recov", JSON.stringify(recov))
      navigate("/recovery")
    }
  }, [dataEmail])

  return (
    <div className="auth-container">
      <Card className="signin-card">
        <Card.Body>
          {isPendingSignIn && <LdsBar />}
          {isPendingEmail && <LdsBar />}
          <div className="text-center mb-4">
            <h3>INICIO DE SESIÓN</h3>
          </div>
          {/* {dataSignIn?.error && !isPendingSignIn && (
            <Alert variant="danger" className="p-2 text-wrap text-center">
              {dataSignIn.msg}
            </Alert>
          )} */}
          <Form className="form-login" onSubmit={handleSubmit(onSubmit)}>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Usuario"
                type="text"
                isInvalid={!!errors.username}
                {...register("username")}
                autoFocus
              />
              <InputGroup.Text>
                <DynaIcon name="FaUser" />
              </InputGroup.Text>
              {errors.username && (
                <Form.Control.Feedback type="invalid">
                  {errors.username.message}
                </Form.Control.Feedback>
              )}
            </InputGroup>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Contraseña"
                type="password"
                isInvalid={!!errors.password}
                {...register("password")}
              />
              <InputGroup.Text>
                <DynaIcon name="FaLock" />
              </InputGroup.Text>
              {errors.password && (
                <Form.Control.Feedback type="invalid">
                  {errors.password.message}
                </Form.Control.Feedback>
              )}
            </InputGroup>
            <InputGroup className="mb-3">
              <Form.Select
                isInvalid={!!errors.establecimiento_id}
                {...register("establecimiento_id", {valueAsNumber: true})}
              >
                <option value="0">- Establecimiento -</option>
                {establecimientosOpc &&
                  establecimientosOpc.map((el) => (
                    <option key={el.id} value={el.id}>
                      {el.descripcion}
                    </option>
                  ))}
              </Form.Select>
              <InputGroup.Text>
                <FaStore />
              </InputGroup.Text>
              {errors.establecimiento_id && (
                <Form.Control.Feedback type="invalid">
                  {errors.establecimiento_id.message}
                </Form.Control.Feedback>
              )}
            </InputGroup>
            <div className="d-flex justify-content-center align-items-center mb-3">
              <Button
                variant="primary" 
                type="submit"
                disabled={isPendingSignIn}
              >
                Iniciar sesión
              </Button>
            </div>
          </Form>
          <div>
            <Link to="/signup">Registrarse</Link>
          </div>
          <div>
            <a
              href="#"
              onClick={handleRecovery}
            >
              Olvidé mi contraseña
            </a>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
