import { z } from "zod";
import {
  GRIND_CATEGORIES,
  GRIND_SETTINGS_MESSAGE,
} from "../constants/grind-settings.constant";

// 1. Schema untuk 1 baris item kalibrasi (Category + Min Value + Max Value)
export const grindSettingItemSchema = z
  .object({
    category: z.enum(GRIND_CATEGORIES, {
      message: GRIND_SETTINGS_MESSAGE.ERROR.CATEGORY_REQUIRED,
    }),
    min_value: z
      .string()
      .max(30, { message: GRIND_SETTINGS_MESSAGE.ERROR.MIN_VALUE_MAX_LENGTH })
      .optional()
      .or(z.literal("")),
    max_value: z
      .string()
      .max(30, { message: GRIND_SETTINGS_MESSAGE.ERROR.MAX_VALUE_MAX_LENGTH })
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      // 1. Jika salah satu nilai kosong, anggap valid
      if (!data.min_value || !data.max_value) return true;
      const minNum = Number(data.min_value);
      const maxNum = Number(data.max_value);
      // 2. Jika keduanya angka murni, pastikan max_value >= min_value
      if (!isNaN(minNum) && !isNaN(maxNum)) {
        return maxNum >= minNum;
      }
      // 3. Jika alfanumerik (misal "1A" & "2B"), anggap valid
      return true;
    },
    {
      message: GRIND_SETTINGS_MESSAGE.ERROR.INVALID_RANGE,
      path: ["max_value"], // Pesan error akan muncul di input max_value
    },
  );

// 2. Schema Form Kalibrasi Gilingan (Bulk 7 Baris)
export const grindSettingsFormSchema = z.object({
  tool_id: z
    .string()
    .min(1, { message: GRIND_SETTINGS_MESSAGE.ERROR.UNSELECTED_TOOL }),
  settings: z.array(grindSettingItemSchema),
});

// 3. Type inference untuk React Hook Form
export type GrindSettingItemInput = z.infer<typeof grindSettingItemSchema>;
export type GrindSettingsFormInput = z.infer<typeof grindSettingsFormSchema>;
