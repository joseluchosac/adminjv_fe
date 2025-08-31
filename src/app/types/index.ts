import { z } from "zod";
import {
  RecoveryFormSchema,
  SignInFormSchema,
  SignInRespSchema,
  SignUpFormSchema,
  SignUpRespSchema,
} from "../schemas/auth-schema";
import {
  ProfileSchema,
  ProfileFormSchema,
  UserFormSchema,
  UserItemSchema,
  UserSessionSchema,
  GetUserRespSchema,
  GetProfileRespSchema,
  MutationUserRespSchema,
  CheckAuthRespSchema,
} from "../schemas/users-schema";
import { CajaSchema, FormaPagoSchema, ImpuestoSchema, MotivoNotaSchema, TipoComprobanteSchema, TipoDocumentoSchema, TipoEstablecimientoSchema, TipoMonedaSchema, TipoMovimientoCajaSchema, TipoMovimientoSchema, TipoOperacionSchema, UnidadMedidaSchema } from "../schemas/catalogos-schema";
import { CategoriaSchema } from "../schemas/categorias-schema";
import { ApiRespSchema, ErrorValidateSchema } from "../schemas/generics-schema";

// ✅ TIPO PARA EL EVENTO ON CHANGE DE UN ELEMENTO DE FORMULARIO
export declare type FormControlElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

export type ApiResp = z.infer<typeof ApiRespSchema>

// ✅ TIPOS PARA LAS RESPUESTAS GENERICAS DE LA API
// export interface ApiGenericResp {
//   content?: any; // Puede ser cualquier tipo de contenido
//   error: boolean;
//   msg: string;
//   msgType: "default" | "error" | "info" | "success" | "warning";
//   errorType: string | null;
// }

// ✅ TIPOS PARA LAS RESPUESTAS DE LA API (el content se le agrega despues)
// export interface QueryResp {
//   content?: any; // Puede ser cualquier tipo de contenido
//   error?: boolean;
//   msg?: string;
//   msgType?: "default" | "error" | "info" | "success" | "warning";
//   errorType?: string | null;
// }

export type ErrorValidate = z.infer<typeof ErrorValidateSchema> // Validacion de formularios

// ✅ TIPO PARA LA RESPUESTA DE UNA PETICION DE FILTROS
export type FilterQueryResp = {
  // filas: any;
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
// ✅ TIPOS PARA USUARIOS
export type UserItem = z.infer<typeof UserItemSchema>;
export type UserForm = z.infer<typeof UserFormSchema>;
export type UserSession = z.infer<typeof UserSessionSchema>;
export type ProfileForm = z.infer<typeof ProfileFormSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type RecoveryForm = z.infer<typeof RecoveryFormSchema>;
// export type RestoreForm = {
//   code: string;
//   new_password: string;
//   new_confirm_password: string;
// };
export type GetUserResp = z.infer<typeof GetUserRespSchema>
export type GetProfileResp = z.infer<typeof GetProfileRespSchema>
export type MutationUserResp = z.infer<typeof MutationUserRespSchema>
export type CheckAuthResp = z.infer<typeof CheckAuthRespSchema>
export type SignInForm = z.infer<typeof SignInFormSchema>;
export type SignUpForm = z.infer<typeof SignUpFormSchema>;
export type SignInResp = z.infer<typeof SignInRespSchema>
export type SignUpResp = z.infer<typeof SignUpRespSchema>


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
export type EstablecimientoOpc = {
  id: number;
  codigo: string;
  descripcion: string;
};
export interface EmpresaInfo {
  // Informacion de la empresa y establecimientos para opciones
  razon_social: string;
  nombre_comercial: string;
  ruc: string;
  direccion: string;
  dis_prov_dep: string;
  telefono: string;
  email: string;
  urlLogo: string;
  establecimientosOpc: EstablecimientoOpc[];
}

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
  field_label: string;
  from: string;
  to: string;
  betweenName?: string;
};
export type OrderItem = {
  field_name: string;
  order_dir: "ASC" | "DESC";
  field_label: string;
};

// ✅ TIPOS PARA LOS PARAMETROS DE FILTROS GENERALES
// Para deprecar
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
// Para deprecar
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
export interface ProductoQryRes extends ApiResp {
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
export type DocumentData = {
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
export type QueryDocumentResp = DocumentData | ApiResp;
export type Caja = z.infer<typeof CajaSchema>;
export type FormaPago = z.infer<typeof FormaPagoSchema>;
export type Impuesto = z.infer<typeof ImpuestoSchema>;
export type MotivoNota = z.infer<typeof MotivoNotaSchema>;
export type Rol = {
  id: number;
  rol: string;
  estado?: number;
};
export type TipoComprobante = z.infer<typeof TipoComprobanteSchema>;
export type TipoDocumento = z.infer<typeof TipoDocumentoSchema>;
export type TipoMoneda = z.infer<typeof TipoMonedaSchema>;
export type TipoMovimientoCaja = z.infer<typeof TipoMovimientoCajaSchema>;
export type TipoMovimiento = z.infer<typeof TipoMovimientoSchema>;
export type TipoOperacion = z.infer<typeof TipoOperacionSchema>;
export type TipoEstablecimiento = z.infer<typeof TipoEstablecimientoSchema>;

export type UnidadMedida = z.infer<typeof UnidadMedidaSchema>;

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

export type Categoria = z.infer<typeof CategoriaSchema>
export type CategoriaTree = Categoria & {
  children: CategoriaTree[];
};

export type CategoriaOpc = {
  id: number;
  descripcion: string;
  nivel: number;
  checked: false;
};

export type CommonPeriod = {
  key:
    | "today"
    | "thisWeek"
    | "lastWeek"
    | "thisMonth"
    | "lastMonth"
    | "thisYear"
    | "lastYear";
  text: string;
};

// ContentValidate: es un tipo generico de la forma Record<K,V> representa un tipo de
// objeto cuya clave es K y valor V
// Datos de validaciones de formulario obtenidos desde el back-end
// de la forma: 
// {
//   username:["El usuario no puede tener espacios"], 
//   email: ["email no valido"], ... 
// }
// Deprecar
export type ContentValidate = Record<string, string[]>;
