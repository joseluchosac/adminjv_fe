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
  tipos_movimiento: TipoMovimiento[];
  tipos_operacion: TipoOperacion[];
  unidades_medida: UnidadMedida[];
  departamentos: Departamento[];
  establecimientos: Establecimiento[];
  tipos_establecimiento: string[];
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
  serie_pre: string;
  descripcion_doc: string;
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

export type TipoMovimiento = {
  id: number;
  tipo: string;
  concepto: string;
  origen: string;
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
  tipo: string;
  codigo: string;
  descripcion: string;
  direccion: string;
  ubigeo_inei: string;
  dis_prov_dep: string;
  telefono: string;
  email: string;
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