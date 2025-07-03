import { FilterParams } from "../types";

//--> CLAVES PARA LOCAL STORAGE
export const ls_layoutKey = "ls_layout"

export const selectDark = {
  control: (styles: any) => ({
    ...styles,
    backgroundColor: '#212529',
    borderColor: '#495057',
  }),
  input: (styles: any) => ({ ...styles, color: 'white' }),
  singleValue: (styles: any) => ({ 
    ...styles, 
    color: 'white',
  }),
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
export const lsCurEst = "lsCurEst"


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
  icon_menu: "GoDot",
  padre_id: 0,
  orden: 0,
}

//--> ROLES
// *****************************************************
export const rolFormInit = {
  id: 0,
  rol: "",
}

export const filterParamsInit: FilterParams = {
    offset: 25,
    search: "",
    equals: [],
    between: {field_name: "", range: "", field_label: ""},
    orders: [], 
}
///   ejemplo de uso
// const filterParamsInit_: FilterParams = {
//     offset: 25,
//     search: "",
//     orders: [
//       {field_name: "nombres", order_dir: "ASC", field_label: "Nombres"}
//     ],
//     equals: [
//       {
//         field_name: "establecimiento_id", 
//         field_value: "1", 
//         label_name: "principal", 
//         label_value: "Establecimiento"
//       },
//     ],
//     between: {
//       field_name: "created_at", 
//       field_label:"Creado", 
//       range: "2024-12-18 00:00:00, 2024-12-19 23:59:59"},
// }