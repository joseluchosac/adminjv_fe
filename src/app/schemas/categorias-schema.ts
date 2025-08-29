import z from "zod";
import { CategoriaTree } from "../types";

export const CategoriaSchema = z.object({
  id: z.number(),
  descripcion: z.string(),
  padre_id: z.number().nullable(),
  nivel: z.number(),
  orden: z.number(),
})
export const CategoriasSchema = z.array(CategoriaSchema)

// Esquema recursivo de categorias tree con z.lazy()
export const CategoriaTreeSchema: z.ZodType<CategoriaTree> = CategoriaSchema.extend({
  children: z.array(z.lazy(() => CategoriaTreeSchema)),
});
export const CategoriasTreeSchema= z.array(CategoriaTreeSchema)

export const CategoriasResponseSchema = z.object({
  list: CategoriasSchema,
  tree:CategoriasTreeSchema,
})