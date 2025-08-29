import { z } from "zod";

export const SignInFormSchema = z.object({
  username: z.string().min(1, "Usuario es requerido").max(50, "Se permite máximo 50 caracteres"),
  password: z.string().min(1, "Contraseña es requerida").max(50, "Se permite máximo 50 caracteres"),
  establecimiento_id: z.number().int().min(1, "Elija un establecimiento")
});

export const SignUpFormSchema = z.object({
  username: z.string().min(2, "Minimo 2 caracteres").max(15, "Máximo 15 caracteres"),
  email: z.email("Formato del email no válido")
    .optional().or(z.literal('')),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirm_password: z.string(),
  establecimiento_id: z.number().int().min(1, "Elija un establecimiento")
}).refine(data => data.password === data.confirm_password, {
  message: "Las contraseñas no coinciden",
  path: ["confirm_password"]
});

export const RecoveryFormSchema = z.object({
  recovery_code: z.string().length(6, "Debe ingresar 6 caracteres"),
  new_password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirm_new_password: z.string(),
}).refine(data => data.new_password === data.confirm_new_password, {
  message: "Las contraseñas no coinciden",
  path: ["confirm_new_password"]
});



