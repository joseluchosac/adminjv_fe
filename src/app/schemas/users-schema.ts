import { z } from "zod";
import { ApiRespSchema, ErrorValidateSchema } from "./generics-schema";

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  nombres: z.string(),
  apellidos: z.string(),
  email: z.string(),
  rol_id: z.number(),
  rol: z.string(),
  caja_id: z.number(),
  caja: z.string(),
  estado: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const UserItemSchema = UserSchema.omit({
  rol_id: true, caja_id: true
})

export const UserSessionSchema = UserSchema.omit({
  rol: true, caja: true, estado: true, created_at: true, updated_at: true
})

export const ProfileSchema = UserSchema.omit({
  rol_id: true, caja_id: true, estado: true, created_at: true, updated_at: true
})

// 💡 FORMS
export const UserFormSchema = z.object({
  id: z.number().int().optional(),
  nombres: z.string().min(2, "Minimo 2 caracteres").max(20, "Máximo 20 caracteres"),
  apellidos: z.string().min(2, "Minimo 2 caracteres").max(20, "Máximo 20 caracteres"),
  username: z.string().min(2, "Minimo 2 caracteres").max(15, "Máximo 15 caracteres"),
  email: z.email("Formato del email no válido")
    .optional().or(z.literal('')),
  rol_id: z.number().int().min(1, "El rol es requerido"),
  caja_id: z.number().min(1, "La Caja es requerida"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
    .optional().or(z.literal('')),
  confirm_password: z.string()
    .optional().or(z.literal('')),
}).superRefine((data, ctx) => {
  if (!data.id && !data.password) {
    ctx.addIssue({
      code: "custom",
      message: "La contraseña es requerida",
      path: ["password"]
    });
  }
  if ((data.password || data.confirm_password) && data.password !== data.confirm_password) {
    ctx.addIssue({
      code: 'custom',
      message: "Las contraseñas no coinciden",
      path: ["confirm_password"]
    });
  }
});

export const ProfileFormSchema = z.object({
  id: z.number().int().optional(),
  nombres: z.string().min(2, "Minimo 2 caracteres"),
  apellidos: z.string().min(2, "Minimo 2 caracteres"),
  username: z.string().optional().or(z.literal('')),
  email: z.string().email("Formato del email no válido")
    .optional().or(z.literal('')),
  rol: z.string().optional().or(z.literal('')),
  caja: z.string().optional().or(z.literal('')),
  new_password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
    .optional().or(z.literal('')),
  confirm_new_password: z.string()
    .optional().or(z.literal('')),
}).refine(data => data.new_password === data.confirm_new_password, {
  message: "Las contraseñas no coinciden",
  path: ["confirm_new_password"]
});

// 💡 API RESPONSES
export const GetUserRespSchema = z.union([UserSchema, ApiRespSchema]) 
export const GetProfileRespSchema = z.union([ProfileSchema, ApiRespSchema]) 

export const MutationUserRespSchema = ApiRespSchema.extend({
  content: z.union([UserItemSchema, ErrorValidateSchema])
})

export const CheckAuthRespSchema = ApiRespSchema.extend({
  profile: ProfileSchema
})

export const AuthUserRespSchema = ApiRespSchema.extend({
  token: z.string()
})

