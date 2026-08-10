import { z } from "zod";
import { AUTH_MESSAGES } from "../constants/auth.constants";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email wajib diisi." })
    .email({ message: "Format email tidak valid." }),
  password: z
    .string()
    .min(1, { message: "Kata sandi wajib diisi." }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

