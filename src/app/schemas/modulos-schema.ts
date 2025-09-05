import z from "zod";

export const ModuloSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  descripcion: z.string(),
  padre_id: z.number(),
  icon_menu: z.string(),
  orden: z.number(),
  assign: z.boolean().optional(),
  children: z.any().optional(),
})

export const ModulosSchema = z.array(ModuloSchema)