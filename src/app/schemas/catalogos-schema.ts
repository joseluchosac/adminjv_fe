import z from "zod";


export const CajaSchema = z.object({
  id: z.number(),
  establecimiento_id: z.number(),
  descripcion: z.string(),
  estado: z.number()
})
export const CajasSchema = z.array(CajaSchema)

export const UnidadMedidaSchema = z.object({
  codigo: z.string(),
  descripcion: z.string(),
  descripcion_abv: z.string(),
  estado: z.number()
})
export const UnidadesMedidaSchema = z.array(UnidadMedidaSchema)

export const ImpuestoSchema = z.object({
  id: z.number(),
  afectacion_igv_cod: z.string(),
  afectacion_igv_desc: z.string(),
  letra_tributo: z.string(),
  codigo_tributo: z.string(),
  nombre_tributo: z.string(),
  tipo_tributo: z.string(),
  porcentaje: z.number(),
  importe: z.number(),
  pred: z.number(),
  estado: z.number(),
})
export const ImpuestosSchema = z.array(ImpuestoSchema)

export const MotivoNotaSchema = z.object({
  codigo: z.string(),
  descripcion: z.string(),
  estado: z.number(),
  id: z.number(),
  tipo: z.string(),
  tipo_comprobante_cod: z.string(),
})
export const MotivosNotaSchema = z.array(MotivoNotaSchema)

export const TipoDocumentoSchema = z.object({
  id: z.number(),
  codigo: z.string(),
  descripcion: z.string(),
  descripcion_abv: z.string(),
  estado: z.number(),
})
export const TiposDocumentoSchema = z.array(TipoDocumentoSchema)

export const TipoComprobanteSchema = z.object({
  id: z.number(),
  codigo: z.string(),
  descripcion: z.string(),
  serie_pre: z.string(),
  descripcion_doc: z.string(),
  estado: z.number(),
})
export const TiposComprobanteSchema = z.array(TipoComprobanteSchema)

export const TipoMovimientoCajaSchema = z.object({
  id: z.number(),
  descripcion: z.string(),
  estado: z.number(),
})
export const TiposMovimientoCajaSchema = z.array(TipoMovimientoCajaSchema)

export const TipoMovimientoSchema = z.object({
  id: z.number(),
  tipo: z.string(),
  concepto: z.string(),
  origen: z.string(),
  estado: z.number(),
})
export const TiposMovimientoSchema = z.array(TipoMovimientoSchema)

export const TipoOperacionSchema = z.object({
  codigo: z.string(),
  descripcion: z.string(),
  estado: z.number(),
})
export const TiposOperacionSchema = z.array(TipoOperacionSchema)

export const TipoMonedaSchema = z.object({
  id: z.number(),
  codigo: z.string(),
  descripcion: z.string(),
  simbolo: z.string(),
  pred: z.number(),
  estado: z.number(),
})
export const TiposMonedaSchema = z.array(TipoMonedaSchema)

export const TipoEstablecimientoSchema = z.string()
export const TiposEstablecimientoSchema = z.array(TipoEstablecimientoSchema)

export const FormaPagoSchema = z.object({
  id: z.number(),
  descripcion: z.string(),
  estado: z.number(),
})
export const FormasPagoSchema = z.array(FormaPagoSchema)