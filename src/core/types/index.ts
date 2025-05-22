// ✅ TIPO PARA EL EVENTO ON CHANGE DE UN ELEMENTO DE FORMULARIO
export declare type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;


// ✅ TIPO PARA EL MODULO AUTH
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

// ✅ TIPOS PARA LA TABLA USUARIOS
// *****************************************************

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

// ✅ TIPOS PARA LA TABLA CAJAS
export interface CajaT {
  id: number;
  descripcion: string
}
// ✅ TIPOS PARA LA TABLA MODULOS
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

// ✅ TIPOS PARA LA TABLA TAREAS
export interface TareaT {
  id: number;
  descripcion: string;
  encargado: string;
}

// ✅ TIPOS PARA LA TABLA CONFIGURACIONES
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



// ✅ TIPOS PARA FILTROS GENERALES
export interface FilterParams {
  offset: number;
  search: string;
  equals: FilterParamsEqual[];
  between: FilterParamsBetween;
  orders: FilterParamsOrder[];
}
export type FilterCurrent = Omit<FilterParams, "offset" | "search">
export type FilterParamsEqual = {
  campo_name: string;
  value: string;
  text: string;
  campo_text: string
}

export type FilterParamsBetween = {
  campo_name: string;
  campo_text: string;
  range: string
}

export type FilterParamsOrder = {
  campo_name: string;
  order_dir: string;
  text: string
}

// ✅ TIPOS PARA EL CAMPO DE UNA TABLA
// *****************************************************
export type CampoTable = {
  campo_name: string;
  text: string;
  orderable?: boolean;
  order_dir: string;
  show: boolean
}

// ✅ TIPOS PARA CATEGORIAS
export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  padre_id: number;
  icon: string;
  orden: number;
  estado: number;
  children?: any;
}
// ✅ TIPOS PARA TABLA LABORATORIOS
export interface Laboratorio {
  id: number;
  nombre: string;
  estado: number;
}
// ✅TIPOS PARA TABLA MARCAS 
export interface Marca {
  id: number;
  nombre: string;
  estado: number;
}

// ✅ TIPOS PARA LAS RESPUESTAS DE LA API (el content se le agrega despues)
export type ResponseQuery = {
  error?: boolean;
  msg?: string;
  msgType?: "default" | "error" | "info" | "success" | "warning";
}