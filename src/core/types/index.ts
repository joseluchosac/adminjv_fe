// ✅ TIPO PARA EL EVENTO ON CHANGE DE UN ELEMENTO DE FORMULARIO
export declare type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

// ✅ TIPOS PARA LAS RESPUESTAS DE LA API (el content se le agrega despues)
export interface ResponseQuery {
  error?: boolean;
  msg?: string;
  msgType?: "default" | "error" | "info" | "success" | "warning";
  errorType?: string;
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
  username: string; password: string, establecimiento_id: string;
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
export type UserItem = {
  id: number;
  nombres: string;
  apellidos: string;
  username: string;
  email: string;
  rol_id: number;
  rol: string;
  caja_id: number;
  caja: string;
  estado: number;
  created_at: string;
  updated_at: string;
}
export interface FilterUsersResp extends FilterResp {
  filas: UserItem[];
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
export type FilterFetchParam = {
  token: string | null;
  filterParams: FilterParams;
  signal: AbortSignal;
  url: string;
  curEstab?: number
}
// observar el de abajo para eliminar
export type FilterFetch = {
  page: number;
  token: string | null;
  filterParams: FilterParams;
  signal: AbortSignal
}

// ✅ TIPO PARA RESPUESTA DE UNA PETICION DE FILTRO
type FilterResp = {
  num_regs: number;
  pages: number;
  page: number;
  next: number;
  previous: number;
  offset: number;
  error?: boolean;
  msg?: string;
  msgTye?: string
}
// ✅ TIPO PARA MOSTRAR LA INFORMACION DEL FILTRO
export type FilterInfo = Omit<FilterParams, "offset">
// eliminar el de abajo
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

export type ProductoItem = {
  id: number;
  establecimiento_id: number;
  codigo: string;
  barcode: string;
  descripcion: string;
  marca_id: number;
  marca: string;
  laboratorio_id: number;
  laboratorio: string;
  stock: number;
  unidad: string;
  estado: number;
  created_at: string;
  updated_at: string;
}

export interface FilterProductosResp extends FilterResp {
  filas: ProductoItem[];
}
export interface DataGetProducto extends ResponseQuery {
  content: Producto | null;
}

// ✅ TIPOS PARA TABLA LABORATORIOS
export interface Laboratorio {
  id: number;
  nombre: string;
  estado: number;
}
export type LaboratorioItem = {
  id: number;
  nombre: string;
  estado: number;
}
export interface FilterLaboratoriosResp extends FilterResp {
  filas: LaboratorioItem[];
}
// ✅TIPOS PARA TABLA MARCAS 
export interface Marca {
  id: number;
  nombre: string;
  estado: number;
}

export type MarcaItem = {
  id: number;
  nombre: string;
  estado: number;
}
export interface FilterMarcasResp extends FilterResp {
  filas: MarcaItem[];
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
export type ProveedorItem = {
  id: number;
  tipo_documento: string;
  nro_documento: string;
  nombre_razon_social: string;
  direccion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  email: string;
  telefono: string;
  estado: number;
}
export interface FilterProveedoresResp extends FilterResp {
  filas: ProveedorItem[];
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
export type ClienteItem = {
  id: number;
  tipo_documento: string;
  nro_documento: string;
  nombre_razon_social: string;
  direccion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  email: string;
  telefono: string;
  estado: number;
}
export interface FilterClientesResp extends FilterResp {
  filas: ClienteItem[];
}
// ✅ TIPOS PARA UBIGEO
export interface Ubigeo {
  ubigeo_inei: string;
  ubigeo_reniec: string;
  dis_prov_dep: string;
}
export interface UbigeoItem {
  ubigeo_inei: string;
  ubigeo_reniec: string;
  dis_prov_dep: string;
}
export interface FilterUbigeosResp extends FilterResp {
  filas: UbigeoItem[];
}
// ✅ TIPOS PARA MOVIMIENTO
export type Movimiento = {
  id: number;
  establecimiento_id: number;
  establecimiento: string;
  fecha: string;
  numeracion: string;
  tipo: string;
  concepto: string;
  estado: number;
  created_at: string;
}
export type MovimientoItem = {
  id: number;
  establecimiento_id: number;
  establecimiento: string;
  tipo: string;
  concepto: string;
  fecha: string;
  numeracion: string;
  estado: number;
  created_at: string;
}
export interface FilterMovimientosResp extends FilterResp {
  filas: MovimientoItem[];
}
export type Movimientoform = {
  establecimiento_id: number;
  tipo: string;
  serie_pre: string;
  concepto: string;
  destino_id: number;
  observacion: string;
  detalle: MovimientoFormDetalle[];
}

export type MovimientoFormDetalle = {
  tmp_id: number;
  codigo: string;
  movimiento_id: number;
  producto_id: number;
  producto_descripcion: string;
  marca: string;
  laboratorio: string;
  stock: number;
  cantidad: number;
  precio_costo: number;
  observacion: string;
}

export interface DataGetMovimiento extends ResponseQuery {
  content: Movimiento | null;
}


export type Numeracion = {
  id: number;
  establecimiento_id: number;
  descripcion_doc: string;
  serie_pre: string;
  serie_suf: string;
  serie: string;
  correlativo: number;
  estado: number;
}

export interface MutationFetch {
  newValues?: any;
  url?: string;
  method?: string;
  headers?: any;
  body?: any
}