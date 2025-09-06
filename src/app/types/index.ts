import { z } from "zod";

import {
  ProfileFormSchema,
  UserFormSchema,
  RecoveryFormSchema,
  SignInFormSchema,
  SignUpFormSchema,
  UserSchema,
} from "../schemas/users-schema";
import { 
  CajaSchema, 
  FormaPagoSchema, 
  ImpuestoSchema, 
  MotivoNotaSchema, 
  TipoComprobanteSchema, 
  TipoDocumentoSchema, 
  TipoEstablecimientoSchema, 
  TipoMonedaSchema, 
  TipoMovimientoCajaSchema, 
  TipoMovimientoSchema, 
  TipoOperacionSchema, 
  UnidadMedidaSchema 
} from "../schemas/catalogos-schema";
import { CategoriaSchema } from "../schemas/categorias-schema";
import { ApiRespSchema, ErrorValidateSchema } from "../schemas/generics-schema";
import { ModuloSchema } from "../schemas/modulos-schema";

// ✅ TIPO PARA EL EVENTO ON CHANGE DE UN ELEMENTO DE FORMULARIO
export declare type FormControlElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

// ✅ TIPO PARA LAS RESPUESTAS GENERICAS DE LA API
export type ApiResp = z.infer<typeof ApiRespSchema>

export type ErrorValidate = z.infer<typeof ErrorValidateSchema> // Validacion de formularios

// ✅ TIPO PARA LA RESPUESTA DE UNA PETICION DE FILTROS
export type FilterQueryResp = {
  // filas: any;
  num_regs: number;
  pages: number;
  page: number;
  next: number;
  previous: number;
  per_page: number;
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

// ✅✅✅ TIPOS PARA LOS PARAMETROS DE FILTROS GENERALES NUEVO ✅✅✅
export interface FilterParam {
  per_page: number;
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

// ✅ TIPOS PARA LAS OPCIONES DE PETICION FETCH
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
export type CommonPeriod = { // Para filtrar por rango de fechas
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

// ✅ TIPOS PARA LOS CATALOGOS
// Ubigeos
export interface UbigeoItem {
  ubigeo_inei: string;
  ubigeo_reniec: string;
  dis_prov_dep: string;
}
export type Provincia = { provincia: string;};
export type Distrito = {distrito: string; ubigeo_inei: string;};

export type Caja = z.infer<typeof CajaSchema>;
export type FormaPago = z.infer<typeof FormaPagoSchema>;
export type Impuesto = z.infer<typeof ImpuestoSchema>;
export type MotivoNota = z.infer<typeof MotivoNotaSchema>;
export type TipoComprobante = z.infer<typeof TipoComprobanteSchema>;
export type TipoDocumento = z.infer<typeof TipoDocumentoSchema>;
export type TipoMoneda = z.infer<typeof TipoMonedaSchema>;
export type TipoMovimientoCaja = z.infer<typeof TipoMovimientoCajaSchema>;
export type TipoMovimiento = z.infer<typeof TipoMovimientoSchema>;
export type TipoOperacion = z.infer<typeof TipoOperacionSchema>;
export type TipoEstablecimiento = z.infer<typeof TipoEstablecimientoSchema>;
export type UnidadMedida = z.infer<typeof UnidadMedidaSchema>;
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





// ✅ TIPOS PARA LA TABLA MODULOS
export type Modulo = z.infer<typeof ModuloSchema>
// export type Modulo = {
//   id: number;
//   nombre: string;
//   descripcion: string;
//   padre_id: number;
//   icon_menu: string;
//   orden: number;
//   assign?: boolean;
//   children?: any;
// }

export interface Padre {
  id: number;
  descripcion: string;
}

// ✅ TIPOS PARA ROL
export type Rol = {
  id: number;
  rol: string;
  estado?: number;
};

// ✅ TIPOS PARA MODULO-ROL
export type ModuloRol = {
  id: number;
  nombre: string;
  descripcion: string;
  icon_menu: string;
  padre_id: number;
  orden: number;
  assign: boolean;
};

// ✅ TIPOS PARA USUARIOS Y AUTH
export interface UsersFilQryRes extends FilterQueryResp { 
  filas: UserItem[] 
}
export type User = z.infer<typeof UserSchema>
export type UserItem = Omit<User, 'rol_id' | 'caja_id'>;
export type UserForm = z.infer<typeof UserFormSchema>;
export type UserSession = Omit<User, 'rol' | 'caja' | 'estado' | 'created_at' | 'updated_at'>;
export type ProfileForm = z.infer<typeof ProfileFormSchema>;
export type Profile = Omit<User, 'rol_id' | 'caja_id' | 'estado' | 'created_at' | 'updated_at'>;
export type RecoveryForm = z.infer<typeof RecoveryFormSchema>;
export type GetUserResp = User | ApiResp
export type GetProfileResp = Profile | ApiResp
export interface MutationUserResp extends ApiResp {
  content: UserItem | ErrorValidate
}
export interface CheckAuthResp extends ApiResp {
  profile: Profile
}
export type SignInForm = z.infer<typeof SignInFormSchema>;
export type SignUpForm = z.infer<typeof SignUpFormSchema>;
export type SignInResp = {token: string} | ApiResp
export type SignUpResp = {token: string} | ApiResp


// ✅ TIPOS PARA CONFIGURACIONES
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

// ✅ TIPOS PARA LABORATORIOS
export interface LaboratoriosFilQryRes extends FilterQueryResp {
  filas: LaboratorioItem[];
}
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

// ✅TIPOS PARA MARCAS
export interface MarcasFilQryRes extends FilterQueryResp {
  filas: MarcaItem[];
}
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

// ✅ TIPOS PARA CLIENTES
export interface ClientesFilQryRes extends FilterQueryResp {
  filas: ClienteItem[];
}
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

// ✅ TIPOS PARA PROVEEDORES
export interface ProveedoresFilQryRes extends FilterQueryResp {
  filas: ProveedorItem[];
}
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


// ✅ TIPOS PARA MOVIMIENTOS
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

// ✅ TIPOS PARA NUMERACION
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




// ✅ TIPOS PARA CATEGORIAS
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