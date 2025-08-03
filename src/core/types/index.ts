import { z } from "zod";
import { profileFormSchema, registerFormSchema, userFormSchema } from "./schemas";

// ✅ TIPO PARA EL EVENTO ON CHANGE DE UN ELEMENTO DE FORMULARIO
export declare type FormControlElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

// ✅ TIPOS PARA LAS RESPUESTAS DE LA API (el content se le agrega despues)
export interface QueryResp {
  content?: any; // Puede ser cualquier tipo de contenido
  error?: boolean;
  errors?: any;
  msg?: string;
  msgType?: "default" | "error" | "info" | "success" | "warning";
  errorType?: string;
}
// ✅ TIPO PARA LA RESPUESTA DE UNA PETICION DE FILTROS
export type FilterQueryResp = {
  num_regs: number;
  pages: number;
  page: number;
  next: number;
  previous: number;
  offset: number;
  error?: boolean;
  msg?: string;
  msgTye?: string;
};
// ✅ TIPOS PARA EL CAMPO DE UNA TABLA
export type CampoTable = {
  field_name: string;
  field_label: string;
  orderable?: boolean;
  order_dir: string;
  show: boolean;
};
// ✅ TIPO PARA EL MODULO AUTH
export type FormsAuth = {
  formOfLogin: string;
  formOfForgot: string;
};
export type LoginForm = {
  username: string;
  password: string;
  establecimiento_id: string;
};
export type RestoreForm = {
  code: string;
  new_password: string;
  new_confirm_password: string;
};
// ✅ TIPOS PARA USUARIO
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
  estado: number;
  created_at: string;
  updated_at: string;
  password: string;
  confirm_password: string;
};
// tipos para el formulario de usuario
export type UserFormType = z.infer<typeof userFormSchema>;
// tipos para los items de lista de usuarios
export type UserItem = {
  id: number;
  nombres: string;
  apellidos: string;
  username: string;
  email: string;
  rol: string;
  caja: string;
  estado: number;
  created_at: string;
  updated_at: string;
};
export type RegisterFormType = z.infer<typeof registerFormSchema>;

// Depreacarted, use UserFormType instead
// export type UserForm = {
//   id: number;
//   nombres: string;
//   apellidos: string;
//   username: string;
//   email: string;
//   rol_id: number;
//   caja_id: number;
//   password: string;
//   confirm_password: string;
// }

export type UserSession = Omit<
  User,
  | "password"
  | "confirm_password"
  | "rol"
  | "caja"
  | "estado"
  | "created_at"
  | "updated_at"
>;
export type ProfileFormType = z.infer<typeof profileFormSchema>;

export type Profile = {
  id: number;
  nombres: string;
  apellidos: string;
  username: string;
  email: string;
  rol: string;
  caja: string;
};

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
  dis_prov_dep: string;
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
};

export type EmpresaSession = {
  // para la sesion
  razon_social: string;
  nombre_comercial: string;
  ruc: string;
  direccion: string;
  dis_prov_dep: string;
  telefono: string;
  email: string;
  urlLogo: string;
};
// ✅✅✅ TIPOS PARA LOS PARAMETROS DE FILTROS GENERALES NUEVO ✅✅✅
export interface FilterParam {
  offset: number;
  search: string;
  equal: EqualItem[];
  between: BetweenItem[];
  order: OrderItem[];
}

export type EqualItem = {
  field_name: string;
  field_value: string | string[] | number[];
  field_label: string;
};
export type BetweenItem = {
  field_name: string;
  from: string;
  to: string;
  field_label: string;
};
export type OrderItem = {
  field_name: string;
  order_dir: "ASC" | "DESC";
  field_label: string;
};

// ✅ TIPOS PARA LOS PARAMETROS DE FILTROS GENERALES
export interface FilterParams {
  offset: number;
  search: string;
  equals: FilterParamsEqual[];
  between: FilterParamsBetween;
  orders: FilterParamsOrder[];
}
type FilterParamsEqual = {
  field_name: string; // rol_id
  field_value: string; // 3
  label_name: string; // rol
  label_value: string; // vendedor
};
type FilterParamsBetween = {
  field_name: string;
  field_label: string;
  range: string;
};
type FilterParamsOrder = {
  field_name: string;
  order_dir: string;
  field_label: string;
};
// ✅ TIPOS PARA LAS OPCIONES DEL FETCH
export type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  body?: BodyInit | null | undefined;
  includeCredentials?: boolean;
  signal?: AbortSignal | null;
  head_contentType?: string;
  authorization?: string;
  attachedData?: any;
};

// ✅ TIPO PARA MOSTRAR LA INFORMACION DEL FILTRO
export type InfoFilter = Omit<FilterParam, "offset">;
export type FilterInfo = Omit<FilterParams, "offset">;

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
  codigo: string;
  barcode: string;
  descripcion: string;
  marca_id: number;
  marca: string;
  laboratorio_id: number;
  laboratorio: string;
  stocks: stocksItem[];
  unidad_medida_cod: string;
  estado: number;
};
type stocksItem = { e: string; s: string };
export interface ProductoQryRes extends QueryResp {
  content: Producto;
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
};

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
};

// ✅ TIPOS PARA CLIENTE
export type Cliente = {
  id: number;
  tipo_documento_cod: string;
  nro_documento: string;
  nombre_razon_social: string;
  direccion: string;
  ubigeo_inei: string;
  dis_prov_dep: string;
  email: string;
  telefono: string;
  api?: number;
};
export type ClienteItem = {
  id: number;
  tipo_documento: string;
  nro_documento: string;
  nombre_razon_social: string;
  direccion: string;
  dis_prov_dep: string;
  email: string;
  telefono: string;
  estado: number;
};

// ✅ TIPOS PARA PROVEEDOR
export type Proveedor = {
  id: number;
  tipo_documento_cod: string;
  nro_documento: string;
  nombre_razon_social: string;
  direccion: string;
  ubigeo_inei: string;
  dis_prov_dep: string;
  email: string;
  telefono: string;
  api?: number;
};
export type ProveedorItem = {
  id: number;
  tipo_documento: string;
  nro_documento: string;
  nombre_razon_social: string;
  direccion: string;
  dis_prov_dep: string;
  email: string;
  telefono: string;
  estado: number;
};
export interface UbigeoItem {
  ubigeo_inei: string;
  ubigeo_reniec: string;
  dis_prov_dep: string;
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
};
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
};
export type Movimientoform = {
  establecimiento_id: number;
  campo_stock: string;
  tipo: string;
  serie_pre: string;
  concepto: string;
  destino_id: number;
  observacion: string;
  detalle: MovimientoFormDetalle[];
};
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
};
export type Numeracion = {
  id: number;
  establecimiento_id: number;
  descripcion_doc: string;
  serie_pre: string;
  serie_suf: string;
  serie: string;
  correlativo: number;
  estado: number;
};
export type NroDocumento = {
  id: number;
  nombre_razon_social: string;
  nro_documento: string;
  tipo_documento_cod: string;
  condicion_sunat: string;
  estado_sunat: string;
  direccion: string;
  ubigeo: string;
  dis_prov_dep: string;
  email: string;
  telefono: string;
};
export type Caja = {
  id: number;
  establecimiento_id: number;
  descripcion: string;
  estado: number;
};
export type FormaPago = {
  id: number;
  descripcion: string;
  estado: number;
};
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
  pred: number;
  estado: number;
};
export type MotivoNota = {
  codigo: string;
  descripcion: string;
  estado: number;
  id: number;
  tipo: string;
  tipo_comprobante_cod: string;
};
export type Rol = {
  id: number;
  rol: string;
  estado?: number;
};
export type TipoComprobante = {
  id: number;
  codigo: string;
  descripcion: string;
  serie_pre: string;
  descripcion_doc: string;
  estado: number;
};
export type TipoDocumento = {
  id: number;
  codigo: string;
  descripcion: string;
  descripcion_abv: string;
  estado: number;
};
export type TipoMoneda = {
  id: number;
  codigo: string;
  descripcion: string;
  simbolo: string;
  pred: number;
  estado: number;
};
export type TipoMovimientoCaja = {
  id: number;
  descripcion: string;
  estado: number;
};
export type TipoMovimiento = {
  id: number;
  tipo: string;
  concepto: string;
  origen: string;
  estado: number;
};
export type TipoOperacion = {
  codigo: string;
  descripcion: string;
  estado: number;
};
export type UnidadMedida = {
  codigo: string;
  descripcion: string;
  descripcion_abv: string;
  estado: number;
};
export type Provincia = {
  provincia: string;
};
export type Distrito = {
  distrito: string;
  ubigeo_inei: string;
};
export type Establecimiento = {
  id: number;
  tipo: string;
  codigo: string;
  descripcion: string;
  direccion: string;
  ubigeo_inei: string;
  dis_prov_dep: string;
  telefono: string;
  email: string;
  campo_stock: string;
  estado: number;
};
export type EstablecimientoOption = {
  id: number;
  codigo: string;
  descripcion: string;
};
export type Categoria = {
  id: number;
  descripcion: string;
  padre_id: number;
  orden: number;
  children?: any;
};
export type CategoriaOpc = {
  id: number;
  descripcion: string;
  nivel: number;
  checked: false;
};
