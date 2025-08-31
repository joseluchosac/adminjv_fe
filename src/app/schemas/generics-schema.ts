import z from "zod";

export const ApiRespSchema = z.object({
  content: z.any().optional(),
  error: z.boolean().optional(),
  msg: z.string().optional(),
  msgType: z.enum(["default", "error", "info", "success", "warning"]).optional(),
  errorType: z.string().nullable().optional(),
});

// ErrorValidate schema: un objeto con claves string y valores que son arrays de strings
export const ErrorValidateSchema = z.record(z.string(), z.array(z.string()));


