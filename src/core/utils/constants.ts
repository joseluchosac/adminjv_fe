import { CampoTable, Cliente, FilterInfo, InfoFilter, FilterParam, FilterParams, Proveedor } from "../types";

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
/*
  const filterParamsInit_: FilterParams = {
    offset: 25,
    search: "",
    orders: [
      {field_name: "nombres", order_dir: "ASC", field_label: "Nombres"}
    ],
    equals: [
      {
        field_name: "establecimiento_id", 
        field_value: "1", 
        label_name: "principal", 
        label_value: "Establecimiento"
      },
    ],
    between: {
      field_name: "created_at", 
      field_label:"Creado", 
      range: "2024-12-18 00:00:00, 2024-12-19 23:59:59"
    },
  }
*/


// ✅✅NUEVA ESTRUCTURA FILTER PARAMS✅✅
export const filterParamInit: FilterParam = {
  offset: 25,
  search: "",
  equal: [],
  between: [],
  order: []
}

/* const ejemploFilterParam = {
  offset: 25,
  search: "joel",
  equal: [
    { fieldName: 'rol_id', fieldValue: [2,3] },
    { fieldName: 'estado', fieldValue: 1 }
  ],
  between: [
    { fieldName: 'created_at', from: '2024-12-17', to: '2024-12-19' },
    { fieldName: 'updated_at', from: '2025-03-21', to: '2025-12-18' }
  ],
  order: [
    { fieldName: 'apellidos', dir: 'ASC' },
    { fieldName: 'nombres', dir: 'DESC' }
  ]
} */
//--> ROLES
// *****************************************************
export const filterInfoInit: FilterInfo = {
  search:"",
  equals: [],
  between: {field_name: "", field_label: "", range: ""},
  orders: [], 
}
export const InfoFilterInit: InfoFilter = {
  search:"",
  equal: [],
  between: [],
  order: [], 
}

//--> CLIENTES
// *****************************************************
export const clienteFormInit: Cliente = {
  id: 0,
  tipo_documento_cod: "0",
  nro_documento: "",
  nombre_razon_social: "",
  direccion: '',
  ubigeo_inei: "",
  dis_prov_dep:"",
  email: "",
  telefono: "",
  api: 0,
}
//--> CLIENTES
// *****************************************************
export const proveedorFormInit: Proveedor = {
  id: 0,
  tipo_documento_cod: "0",
  nro_documento: "",
  nombre_razon_social: "",
  direccion: '',
  ubigeo_inei: "",
  dis_prov_dep:"",
  email: "",
  telefono: "",
  api: 0,
}

export const camposUserInit: CampoTable[] = [
  {show: true, orderable: false, order_dir:"", field_name: "acciones", field_label:"Acciones",},
  {show: false, orderable: true, order_dir:"", field_name: "id", field_label:"Id",},
  {show: true, orderable: true, order_dir:"", field_name: "username", field_label:"Usuario",},
  {show: true, orderable: true, order_dir:"", field_name: "nombres", field_label:"Nombres",},
  {show: true, orderable: true, order_dir:"", field_name: "apellidos", field_label:"Apellidos",},
  {show: true, orderable: true, order_dir:"", field_name: "email", field_label:"Email",},
  {show: false, orderable: false, order_dir:"", field_name: "estado", field_label:"Estado",},
  {show: true, orderable: true, order_dir:"", field_name: "rol", field_label:"Rol",},
  {show: true, orderable: true, order_dir:"", field_name: "caja", field_label:"Caja",},
  {show: true, orderable: true, order_dir:"", field_name: "created_at", field_label:"F creación",},
  {show: true, orderable: true, order_dir:"", field_name: "updated_at", field_label:"F actualización",},
]

export const camposMarcaInit: CampoTable[] = [
  {show: true, orderable: false, order_dir:"", field_name: "acciones", field_label:"Acciones",},
  {show: false, orderable: true, order_dir:"", field_name: "id", field_label:"Id",},
  {show: true, orderable: true, order_dir:"", field_name: "nombre", field_label:"Nombre",},
  {show: true, orderable: true, order_dir:"", field_name: "estado", field_label:"Estado",},
]
export const camposLaboratorioInit: CampoTable[] = [
  {show: true, orderable: false, order_dir:"", field_name: "acciones", field_label:"Acciones",},
  {show: false, orderable: true, order_dir:"", field_name: "id", field_label:"Id",},
  {show: true, orderable: true, order_dir:"", field_name: "nombre", field_label:"Nombre",},
  {show: true, orderable: true, order_dir:"", field_name: "estado", field_label:"Estado",},
]
export const camposProductoInit: CampoTable[] = [
  {show: true, orderable: false, order_dir:"", field_name: "acciones", field_label:"Acciones",},
  {show: false, orderable: true, order_dir:"", field_name: "id", field_label:"Id",},
  {show: false, orderable: true, order_dir:"", field_name: "codigo", field_label:"Codigo",},
  {show: false, orderable: true, order_dir:"", field_name: "barcode", field_label:"Cód. barras",},
  {show: true, orderable: true, order_dir:"", field_name: "descripcion", field_label:"Descripcion",},
  {show: false, orderable: false, order_dir:"", field_name: "marca_id", field_label:"Marca id",},
  {show: false, orderable: true, order_dir:"", field_name: "marca", field_label:"Marca",},
  {show: false, orderable: false, order_dir:"", field_name: "laboratorio_id", field_label:"Laboratorio id",},
  {show: false, orderable: true, order_dir:"", field_name: "laboratorio", field_label:"Lab",},
  {show: true, orderable: true, order_dir:"", field_name: "stocks", field_label:"Stock",},
  {show: true, orderable: true, order_dir:"", field_name: "undad_medida_cod", field_label:"Unidad",},
  {show: false, orderable: false, order_dir:"", field_name: "estado", field_label:"Estado",},
]
export const camposClienteInit: CampoTable[] = [
  {show: true, orderable: false, order_dir: "", field_name: "acciones", field_label:"",},
  {show: false, orderable: true, order_dir: "", field_name: "id", field_label:"Id",},
  {show: true, orderable: true, order_dir: "", field_name: "nro_documento", field_label:"Nro Doc",},
  {show: true, orderable: true, order_dir: "", field_name: "nombre_razon_social", field_label:"Cliente",},
  {show: true, orderable: true, order_dir: "", field_name: "direccion", field_label:"Dirección",},
  {show: true, orderable: true, order_dir: "", field_name: "email", field_label:"Correo",},
  {show: true, orderable: true, order_dir: "", field_name: "telefono", field_label:"Teléf.",},
]
export const camposProveedorInit: CampoTable[] = [
  {show: true, orderable: true, order_dir:"", field_name: "acciones", field_label:"",},
  {show: false, orderable: true, order_dir:"", field_name: "id", field_label:"Id",},
  {show: true, orderable: true, order_dir:"", field_name: "nro_documento", field_label:"Nro Doc",},
  {show: true, orderable: true, order_dir:"", field_name: "nombre_razon_social", field_label:"Razon Social",},
  {show: true, orderable: true, order_dir:"", field_name: "direccion", field_label:"Dirección",},
  {show: true, orderable: true, order_dir:"", field_name: "email", field_label:"Correo",},
  {show: true, orderable: true, order_dir:"", field_name: "telefono", field_label:"Teléf.",},
]
export const camposMovimientoInit: CampoTable[] = [
    {show: true, orderable: false, order_dir:"", field_name: "acciones", field_label:"Acciones",},
    {show: false, orderable: true, order_dir:"", field_name: "id", field_label:"Id",},
    {show: false, orderable: false, order_dir:"", field_name: "establecimiento_id", field_label:"Establecimiento id",},
    {show: true, orderable: true, order_dir:"", field_name: "establecimiento", field_label:"Establecimiento",},
    {show: true, orderable: true, order_dir:"", field_name: "fecha", field_label:"Fecha",},
    {show: true, orderable: true, order_dir:"", field_name: "numeracion", field_label:"Numeración",},
    {show: true, orderable: true, order_dir:"", field_name: "tipo", field_label:"Tipo",},
    {show: true, orderable: true, order_dir:"", field_name: "concepto", field_label:"Concepto",},
    {show: false, orderable: true, order_dir:"", field_name: "estado", field_label:"Estado",},
    {show: false, orderable: true, order_dir:"", field_name: "created_at", field_label:"Creado",},
];

export const userFormInit = {
  id: 0,
  nombres: "",
  apellidos: "",
  username: "",
  email: "",
  rol_id: 0,
  caja_id: 0,
  password: '',
  confirm_password: '',
}
