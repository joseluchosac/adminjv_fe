//--> TIPOS PARA EL MODULO AUTH

export declare type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

// *****************************************************
export type FormsAuth = {
  formOfLogin: string; formOfForgot: string;
}
export type LoginForm = {
  username: string; password: string;
}
export type RestoreForm = {
  code:string; new_password:string; new_password_repeat:string;
}
//--> TIPOS PARA LA TABLA USUARIOS
// *****************************************************

export interface FilterParamsUsers {
  offset: number;
  search: string;
  equals: FilterParamsUsersEqual[];
  between: FilterParamsUsersBetween;
  orders: FilterParamsUsersOrder[];
}
export type FilterUsersCurrent = Omit<FilterParamsUsers, "offset" | "search">
export type FilterParamsUsersEqual = {
  campo_name: string;
  value: string;
  text: string;
  campo_text: string
}

export type FilterParamsUsersBetween = {
  campo_name: string;
  campo_text: string;
  range: string
}

export type FilterParamsUsersOrder = {
  campo_name: string;
  order_dir: string;
  text: string
}

export type User = {
  id: number;
  nombres: string;
  apellidos: string;
  username: string;
  email: string;
  rol_id: number;
  rol: string;
  caja_id: number;
  caja: string;
  created_at: string;
  updated_at: string;
  estado: number;
  password: string;
  password_repeat: string;
}

export type UserFormT = Omit<User, "rol" | "caja">
export type UserT = Omit<User,"password" | "password_repeat">

export type CampoUserT = {
  campo_name: string;
  text: string;
  order_dir: string;
  show: boolean
}

export interface RegisterForm {
  nombres: string;
  apellidos: string;
  username: string;
  email: string;
  password: string;
  password_repeat: string;
}


//--> TIPOS PARA CATALOGOS
// *****************************************************
export interface Catalogos {
  cajas: Caja[];
  formasPago: FormaPago[];
  impuestos: Impuesto[];
  motivosNota: MotivoNota[];
  roles: Rol[];
  tiposComprobante: TipoComprobante[];
  tiposDocumento: TipoDocumento[];
  tiposMoneda: TipoMoneda[];
  tiposMovimientoCaja: TipoMovimientoCaja[];
  tiposMovimientoProducto: TipoMovimientoProducto[];
  tiposOperacion: TipoOperacion[];
  unidadesMedida: UnidadMedida[];
  departamentos: Departamento[];
}
export type Caja = {
  id: number;
  descripcion: string;
  estado: number;
}
export type FormaPago = {
  id: number;
  descripcion: string;
  estado: number;
}
export type Impuesto = {
  id: number;
  afectacion_igv_cod: string;
  afectacion_igv_desc: string;
  letra_tributo: string;
  codigo_tributo: string;
  nombre_tributo: string;
  tipo_tributo: string;
  porcentaje: number;
  importe: number;
  estado: number
}
export type MotivoNota = {
  codigo : string;
  descripcion : string; 
  estado : number; 
  id : number;
  tipo : string;
  tipo_comprobante_cod : string
}

export type Rol = {
  id: number;
  rol: string;
  estado?: number
}
export type TipoComprobante = {
  id: number;
  codigo: string;
  descripcion: string;
  estado: number
}
export type TipoDocumento = {
  id: number;
  codigo: string;
  descripcion: string;
  descripcion_abv: string;
  estado: number;
}
export type TipoMoneda = {
  id: number;
  codigo: string;
  descripcion: string;
  simbolo: string;
  estado: number;
}
export type TipoMovimientoCaja = {
  id: number;
  descripcion: string;
  estado: number
}
export type TipoMovimientoProducto = {
  id: number;
  codigo: string;
  tipo: string;
  tipo_operacion_cod: string;
  descripcion: string;
  documento: string;
  estado: number
}
export type TipoOperacion = {
  codigo: string;
  descripcion: string;
  estado: number
}
export type UnidadMedida = {
  codigo: string;
  descripcion: string;
  descripcion_abv: string;
  estado: number
}

export type Ubigeo = {
  ubigeo_inei: string;
  departamento: string;
  provincia: string;
  distrito: string;
}

export type Departamento = {
  departamento: string;
}
export type Provincia = {
  provincia: string;
}
export type Distrito = {
  distrito: string;
  ubigeo_inei: string;
}

//--> TIPOS PARA LA TABLA CAJAS
// *****************************************************
export interface CajaT {
  id: number;
  descripcion: string
}
//--> TIPOS PARA LA TABLA MODULOS
// *****************************************************
export interface ModuloT {
  id: number;
  nombre: string;
  descripcion: string;
  padre_id: number;
  icon_menu: string;
  orden: number;
  assign?: boolean;
  children?: any;
}
export type ModuloForm = {
  id: number;
  descripcion: string;
  icon_menu: string;
  nombre: string;
  padre_id: number;
  orden: number;
}

export interface Padre {
  id: number;
  descripcion: string;
}
export type Sorted = {id: number; orden: number}

// TIPOS PARA LA TABLA TAREAS
// *****************************************************
export interface TareaT {
  id: number;
  descripcion: string;
  encargado: string;
}

//--> TIPOS PARA LA TABLA CONFIGURACIONES
// *****************************************************
export type Empresa = {
  razon_social: string;
  nombre_comercial: string;
  ruc: string;
  direccion: string;
  ubigeo_inei: string;
  departamento: string;
  provincia: string;
  distrito: string;
  telefono: string;
  email: string;
  simbolo_moneda: string;
  logo: string;
  certificado_digital: string;
  clave_certificado: string;
  usuario_sol: string;
  clave_sol: string;
  urlLogo: string;
  urlNoImage: string;
  fileLogo: any;
  fileCertificado: any;
}

export type EmpresaSession = { // para la sesion
  razon_social: string;
  nombre_comercial: string;
  ruc: string;
  direccion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  telefono: string;
  email: string;
  urlLogo: string;
}