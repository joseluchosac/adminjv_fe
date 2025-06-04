export interface Catalogos {
  cajas: Caja[];
  formas_pago: FormaPago[];
  impuestos: Impuesto[];
  motivos_nota: MotivoNota[];
  roles: Rol[];
  tipos_comprobante: TipoComprobante[];
  tipos_documento: TipoDocumento[];
  tipos_moneda: TipoMoneda[];
  tipos_movimiento_caja: TipoMovimientoCaja[];
  tipos_movimiento_producto: TipoMovimientoProducto[];
  tipos_operacion: TipoOperacion[];
  unidades_medida: UnidadMedida[];
  departamentos: Departamento[];
  categorias_tree: Categoria[];
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
  pred:number;
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
  pred: number;
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

export type Establecimiento = {
  id: number;
  codigo_establecimiento: string;
  nombre: string;
  direccion: string;
  ubigeo_inei: string;
  departamento: string;
  provincia: string;
  distrito: string;
  telefono: string;
  email: string;
  sucursal: boolean;
  almacen: boolean;
  estado: number;
}

export type SerieEstablecimiento = {
  id: number;
  establecimiento_id: string;
  descripcion: string;
  serie: string;
  serie_prefix: string;
  serie_suffix: string;
  correlativo: string;
  estado: number;
}
export type Categoria = {
  id: number;
  descripcion: string;
  padre_id: number;
  orden: number;
  children?: any;
}
export type CategoriaOpc = {
  id: number;
  descripcion: string;
  nivel: number;
  checked: false
}