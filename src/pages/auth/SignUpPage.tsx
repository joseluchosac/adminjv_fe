import { Button, Card, Form, InputGroup } from "react-bootstrap";
import DynaIcon from "../../app/components/DynaComponents";
import { FaStore } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdMail } from "react-icons/md";
import { useForm } from "react-hook-form";
import { EmpresaInfo, SignUpForm, SignUpResp } from "../../app/types";
import { SignUpFormSchema } from "../../app/schemas/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import useSessionStore from "../../app/store/useSessionStore";
import { useQueryClient } from "@tanstack/react-query";
import { useMutationUsersQuery } from "../../api/queries/useUsersQuery";
import { LdsBar } from "../../app/components/Loaders";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function SignUpPage() {
  const { setTknSession, curEstab, setCurEstab } = useSessionStore();
  const queryClient = useQueryClient()
    
  const {establecimientosOpc} = queryClient.getQueryData(["empresa_info"]) as EmpresaInfo

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignUpForm>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      username: "", 
      email: "", 
      password: "",
      confirm_password: "",
      establecimiento_id: curEstab
    }
  })

  const {
    data: signUpResp,
    isPending: isPendingSignUp,
    signUp, 
  } = useMutationUsersQuery<SignUpResp>()

  const onSubmit = (data: SignUpForm) => {
    if(data.establecimiento_id != curEstab){
      setCurEstab(Number(data.establecimiento_id));
    }
    signUp(data)
  }

  useEffect(() => {
    if(!signUpResp) return
    if('token' in signUpResp){
      setTknSession(signUpResp.token as string || "");
    }else if("error" in signUpResp && signUpResp.error){
      toast(signUpResp.msg || "Hubo un error al obtener los datos", {type: signUpResp.msgType})
    }
  }, [signUpResp])

  return (
    <div className="auth-container">
      <Card className="signup-card">
        <Card.Body>
          {isPendingSignUp && <LdsBar />}
          {/* {isPendingEmail && <LdsBar />} */}
          <div className="text-center mb-3">
            <h3>REGISTRO</h3>
          </div>
          {/* {dataSignIn?.error && !isPendingSignIn && (
            <Alert variant="danger" className="p-2 text-wrap text-center">
              {dataSignIn.msg}
            </Alert>
          )} */}
          <Form className="form-signup" onSubmit={handleSubmit(onSubmit)}>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Usuario"
                isInvalid={!!errors.username}
                {...register("username")}
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
                placeholder="Email"
                type="email"
                isInvalid={!!errors.email}
                {...register("email")}
              />
              <InputGroup.Text>
                <MdMail />
              </InputGroup.Text>
              {errors.email && (
                <Form.Control.Feedback type="invalid">
                  {errors.email.message}
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
              <Form.Control
                placeholder="Confirmar contraseña"
                type="password"
                isInvalid={!!errors.confirm_password}
                {...register("confirm_password")}
              />
              <InputGroup.Text>
                <DynaIcon name="FaLock" />
              </InputGroup.Text>
              {errors.confirm_password && (
                <Form.Control.Feedback type="invalid">
                  {errors.confirm_password.message}
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
                disabled={isPendingSignUp}
              >
                Registrarse
              </Button>
            </div>
          </Form>
          <div className="text-center">¿Ya está registrado(a)? {" - "}
            <Link to="/signin">Iniciar sesión</Link>
          </div>

        </Card.Body>
      </Card>
    </div>
  )
}
