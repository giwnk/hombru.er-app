import { z } from "zod";
import { AUTH_VALIDATION } from "../constants/auth.constants";

export const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(AUTH_VALIDATION.MIN_FULLNAME_LENGTH, {
        message: `Nama lengkap minimal terdiri dari ${AUTH_VALIDATION.MIN_FULLNAME_LENGTH} karakter.`,
      })
      .max(AUTH_VALIDATION.MAX_FULLNAME_LENGTH, {
        message: `Nama lengkap maksimal terdiri dari ${AUTH_VALIDATION.MAX_FULLNAME_LENGTH} karakter.`,
      }),

    username: z
      .string()
      .min(AUTH_VALIDATION.MIN_USERNAME_LENGTH, {
        message: `Username minimal terdiri dari ${AUTH_VALIDATION.MIN_USERNAME_LENGTH} karakter.`,
      })
      .max(AUTH_VALIDATION.MAX_USERNAME_LENGTH, {
        message: `Username maksimal terdiri dari ${AUTH_VALIDATION.MAX_USERNAME_LENGTH} karakter.`,
      })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message:
          "Username hanya boleh berisi huruf, angka, dan garis bawah (_).",
      }),

    email: z
      .string()
      .min(1, { message: "Email wajib diisi." })
      .email({ message: "Format email tidak valid." }),

    password: z
      .string()
      .min(AUTH_VALIDATION.MIN_PASSWORD_LENGTH, {
        message: `Kata sandi minimal terdiri dari ${AUTH_VALIDATION.MIN_PASSWORD_LENGTH} karakter.`,
      }),

    confirmPassword: z
      .string()
      .min(1, { message: "Konfirmasi kata sandi wajib diisi." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi dan konfirmasi kata sandi tidak cocok.",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
