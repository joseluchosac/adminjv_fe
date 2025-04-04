import { useEffect, useState } from "react";
import "./auth.css";
import { useMutationUsersQuery } from "../../core/hooks/useUsersQuery";
import { Bounce, toast, ToastContainer } from "react-toastify";
import useLayoutStore from "../../core/store/useLayoutStore";
import Login from "./Login";
import { LoginForm } from "../../core/types";
import RecoveryPassword from "./RecoveryPassword";

const formsAuth = {
  formOfLogin: "formOfLogin",
  formOfForgot: "formOfForgot",
}

const Auth: React.FC = () => {
  const [loginForm, setLoginForm] = useState<LoginForm>({ username: "", password: "" });
  const [currentForm, setCurrentForm] = useState(formsAuth.formOfLogin)
  const [email, setEmail] = useState("")
  const darkMode = useLayoutStore(state => state.layout.darkMode)

  const {
    data: dataEmail,
    isPending: isPendingEmail,
    getEmailByUsername
  } = useMutationUsersQuery()

  const handleShowForm = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    const newCurrentForm = e.currentTarget.dataset.form ?? ""
    if(currentForm === formsAuth.formOfLogin){
      if(!loginForm.username){
        toast.warning("Ingrese el usuario", {
          autoClose: 3000,
          transition: Bounce,
        })
        return
      }
      getEmailByUsername(loginForm.username)
    }else{
      setCurrentForm(newCurrentForm)
    }
  }

  useEffect(() => {
    if(!dataEmail) return
    if(!dataEmail.error){
      setEmail(dataEmail.email)
      setCurrentForm(formsAuth.formOfForgot)
    }else{
      toast.warning(dataEmail.msg, {
        autoClose: 3000,
        transition: Bounce,
      })
    }
  }, [dataEmail])

  return (
    <div className="login-container position-absolute w-100 top-0 start-0">
        {(currentForm === formsAuth.formOfLogin) &&
          <Login
            isPendingEmail = {isPendingEmail}
            loginForm = {loginForm}
            setLoginForm={setLoginForm}
            handleShowForm = {handleShowForm}
            formsAuth = {formsAuth}
          />
        }

        {(currentForm === formsAuth.formOfForgot) &&
          <RecoveryPassword
            loginForm={loginForm}
            email={email}
            handleShowForm={handleShowForm}
            formsAuth={formsAuth}
          />
        }
        <ToastContainer
          theme={darkMode ? 'dark' : 'light'}
        />
    </div>
  );
};

export default Auth;
