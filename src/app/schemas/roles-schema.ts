import z from "zod";

export const RolSchema = z.object({
  id: z.number(),
  rol: z.string(),
  estado: z.number(),
})

export const RolesSchema = z.array(RolSchema)