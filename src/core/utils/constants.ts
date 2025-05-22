//--> CLAVES PARA LOCAL STORAGE
export const ls_layoutKey = "ls_layout"
export const selectDark = {
  control: (styles: any) => ({ ...styles, backgroundColor: '#212529', borderColor: '#495057' }),
  input: (styles: any) => ({ ...styles, color: 'white' }),
  singleValue: (styles: any) => ({ ...styles, color: 'white' }),
  menuList: (styles: any) => ({ ...styles, backgroundColor: '#2b3035' }),

  option: (styles: any, { isDisabled, isFocused, isSelected }: any) => {
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? "#2684ff"
        : isFocused
        ? "#2684ff20"
        : undefined,
      color: isDisabled
        ? '#888'
        : isSelected
        ? 'white'
        : 'white',
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled
          ? isSelected
            ? "#2684ff"
            : "#2684ff40"
          : undefined,
      },
    };
  },
}

export const lsTknSessionKey = "lsTknSession"

//--> USERS
// *****************************************************


// export const camposUserInit = [
//   {fieldname: "id", text:"Id", order_dir:"", show: false},
//   {fieldname: "nombres", text:"Nombres", order_dir:"", show: true},
//   {fieldname: "apellidos", text:"Apellidos", order_dir:"", show: true},
//   {fieldname: "username", text:"Nombre de usuario", order_dir:"", show: true},
//   {fieldname: "email", text:"Email", order_dir:"", show: true},
//   {fieldname: "estado", text:"Estado", order_dir:"", show: true},
//   {fieldname: "rol", text:"Rol", order_dir:"", show: true},
//   {fieldname: "rol_id", text:"Rol Id", order_dir:"", show: false},
//   {fieldname: "caja", text:"Caja", order_dir:"", show: true},
//   {fieldname: "caja_id", text:"Caja ID", order_dir:"", show: false},
//   {fieldname: "created_at", text:"Fecha creación", order_dir:"", show: true},
//   {fieldname: "updated_at", text:"Fecha actualización", order_dir:"", show: true},
// ]

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