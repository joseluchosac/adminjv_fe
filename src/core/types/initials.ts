// import { UserFormT } from "."

//--> CLAVES PARA LOCAL STORAGE
export const lsTknSessionKey = "lsTknSession"
export const ls_layoutKey = "ls_layout"


//--> USERS
// *****************************************************


export const camposUserInit = [
  {campo_name: "id", text:"Id", order_dir:"", show: false},
  {campo_name: "nombres", text:"Nombres", order_dir:"", show: true},
  {campo_name: "apellidos", text:"Apellidos", order_dir:"", show: true},
  {campo_name: "username", text:"Nombre de usuario", order_dir:"", show: true},
  {campo_name: "email", text:"Email", order_dir:"", show: true},
  {campo_name: "estado", text:"Estado", order_dir:"", show: true},
  {campo_name: "rol", text:"Rol", order_dir:"", show: true},
  {campo_name: "rol_id", text:"Rol Id", order_dir:"", show: false},
  {campo_name: "caja", text:"Caja", order_dir:"", show: true},
  {campo_name: "caja_id", text:"Caja ID", order_dir:"", show: false},
  {campo_name: "created_at", text:"Fecha creación", order_dir:"", show: true},
  {campo_name: "updated_at", text:"Fecha actualización", order_dir:"", show: true},
]

export const registerFormInit = {
  nombres: "",
  apellidos: "",
  username: "",
  email:"",
  password: "",
  password_repeat: '',
}
//--> MODULOS
// *****************************************************
export const moduloFormInit = {
  id: 0,
  nombre: "",
  descripcion: "",
  icon_menu: "FaRegCircle",
  padre_id: 0,
  orden: 0,
}

//--> ROLES
// *****************************************************
export const rolFormInit = {
  id: 0,
  rol: "",
}