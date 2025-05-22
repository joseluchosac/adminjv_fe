import { useEffect, useRef, useState } from "react"
import { UserForm } from "../../../core/types"

const feedbkInit = {
  nombres: "",
  apellidos: "",
  username: "",
  email: "",
  password: "",
  password_repeat: ""
}

function useUserFormValidate(userForm: UserForm) {
  const [validated, setValidated] = useState(false)
  const [feedbk, setFeedbk] = useState(feedbkInit)
  const [validateErr, setValidateErr] = useState(false)

  function isEmptyValuesObject(object: typeof feedbkInit){
    let flag = true
    for(const elem of Object.values(object)){
      if(elem){
        flag = false
        break
      }
    }
    return flag
  }
  const mailValidRegex = useRef(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  const passwordValidRegex = useRef(/^[A-Za-z\d@$!%*?&_]{3,}$/)
  const usernameValidRegex = useRef(/^[A-Za-z\d@$!%*?&_]{3,}$/)

  useEffect(() => {
    const onValidate = () => {
        if(!userForm.nombres.trim()){
          feedbk.nombres = "Ingrese los nombes"
        }else if(userForm.nombres.trim().length < 3){
          feedbk.nombres = "Los nombres deben de tener más de 2 caracteres"
        }else{
          feedbk.nombres = ""
        }

        if(!userForm.apellidos.trim()){
          feedbk.apellidos = "Ingrese los apellidos"
        }else if(userForm.apellidos.trim().length < 3){
          feedbk.apellidos = "Los apellidos deben de tener más de 2 caracteres"
        }else{
          feedbk.apellidos = ""
        }

        if(!userForm.username.trim()){
          feedbk.username = "Nombre de usuario requerido"
        }else if(!userForm.username.match(usernameValidRegex.current)){
          feedbk.username = "Ingrese nombe de usuario válido"
        }else{
          feedbk.username = ""
        }

        if(!userForm.email.match(mailValidRegex.current) && userForm.email != ""){
          feedbk.email = "Ingrese un formato de correo válido"
        }else{
          feedbk.email = ""
        }

        if(!userForm.password.match(passwordValidRegex.current) && !userForm.id ){
          feedbk.password = "Ingrese al menos 3 caracteres sin espacios"
        }else{
          feedbk.password = ""
        }

        if(userForm.password_repeat !== userForm.password && !userForm.id ){
          feedbk.password_repeat = "Los passwords no coinciden"
        }else{
          feedbk.password_repeat = ""
        }

        setFeedbk({...feedbk})
        if(isEmptyValuesObject(feedbk)){
          setValidateErr(false)
        }else{
          setValidateErr(true)
        }
    }
    onValidate()
  }, [userForm])

  return {feedbk, validateErr, validated, setValidated}
}

export default useUserFormValidate