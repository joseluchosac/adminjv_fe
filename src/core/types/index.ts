// ✅ TIPO PARA EL EVENTO ON CHANGE DE UN ELEMENTO DE FORMULARIO
export declare type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

// ✅ TIPOS PARA LAS RESPUESTAS DE LA API (el content se le agrega despues)
export type ResponseQuery = {
  error?: boolean;
  msg?: string;
  msgType?: "default" | "error" | "info" | "success" | "warning";
}
export interface DataGetProducto extends ResponseQuery {
  content: Producto | null;
}
// ✅ TIPOS PARA EL CAMPO DE UNA TABLA
export type CampoTable = {
  field_name: string;
  field_label: string;
  orderable?: boolean;
  order_dir: string;
  show: boolean
}
// ✅ TIPO PARA EL MODULO AUTH
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
export type User = {
  id: number;
  nombres: string;
  apellidos: string;
  username: string;
  email: string;
  rol_id: number;
  rol?: string;
  caja_id: number;
  caja?: string;
  estado: number;
  created_at?: string;
  updated_at?: string;
  password: string;
  password_repeat: string;
}

export interface RegisterForm {
  nombres: string;
  apellidos: string;
  username: string;
  email: string;
  password: string;
  password_repeat: string;
}

// ✅ TIPOS PARA LA TABLA MODULOS
export interface Modulo {
  id: number;
  nombre: string;
  descripcion: string;
  padre_id: number;
  icon_menu: string;
  orden: number;
  assign?: boolean;
  children?: any;
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
type FilterParamsOrder = {
  field_name: string;
  order_dir: string;
  field_label: string
}
type FilterParamsEqual = {
  field_name: string;
  field_value: string; //antes value
  label_name: string; // antes text
  label_value: string // antes campo_text
}
type FilterParamsBetween = {
  field_name: string;
  field_label: string;
  range: string
}

export type FilterCurrent = Omit<FilterParams, "offset" | "search">

// ✅ TIPOS PARA PRODUCTO
export interface Producto {
  id: number;
  codigo: string;
  barcode: string;
  categoria_ids: number[];
  descripcion: string;
  marca_id: number;
  marca: string;
  laboratorio_id: number;
  laboratorio: string;
  unidad_medida_cod: string;
  tipo_moneda_cod: string;
  precio_venta: number;
  precio_costo: number;
  impuesto_id_igv: number;
  impuesto_id_icbper: number;
  inventariable: number;
  lotizable: number;
  stock: number;
  stock_min: number;
  imagen: string;
  estado: number;
  created_at: string;
  updated_at: string;
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



// ✅ TIPOS PARA PROVEEDOR
export type Proveedor = {
  id: number;
  tipo_documento_cod: string;
  tipo_documento: string;
  nro_documento: string;
  nombre_razon_social: string;
  direccion: string;
  ubigeo_inei: string;
  departamento: string;
  provincia: string;
  distrito: string;
  email: string;
  telefono: string;
  api?: number;
  estado?: number;
}

// ✅ TIPOS PARA CLIENTE
export type Cliente = {
  id: number;
  tipo_documento_cod: string;
  tipo_documento: string;
  nro_documento: string;
  nombre_razon_social: string;
  direccion: string;
  ubigeo_inei: string;
  departamento: string;
  provincia: string;
  distrito: string;
  email: string;
  telefono: string;
  api?: number;
  estado?: number;
}