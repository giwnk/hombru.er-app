import { z } from "zod";

/**
 * Zod Schema untuk Sensory Profile berbasis Slider (Skala 0 - 5)
 */
export const sensoryProfileSchema = z.object({
  sweetness: z.number().min(0).max(5),
  acidity: z.number().min(0).max(5),
  body: z.number().min(0).max(5),
  clarity: z.number().min(0).max(5),
  bitterness: z.number().min(0).max(5),
  aftertaste: z.number().min(0).max(5),
  profile_accuracy: z.number().min(0).max(5),
});

export const logBrewSchema = z.object({
  bean_id: z.string().min(1, "Silakan pilih biji kopi yang digunakan"),
  method: z.string().min(1, "Metode seduh wajib diisi"),
  tool_ids: z.array(z.string()).optional().nullable(),
  grind_setting_id: z.string().optional().nullable(),
  grind_size_actual: z.string().optional().nullable(),
  coffee_weight: z
    .number({ message: "Dosis kopi harus berupa angka" })
    .gte(0, "Dosis kopi tidak boleh negatif"),
  water_weight: z
    .number({ message: "Jumlah air harus berupa angka" })
    .gte(0, "Jumlah air tidak boleh negatif"),
  temperature: z.number().min(0).max(100).optional().nullable(),
  pouring_method_id: z.string().optional().nullable(),
  yield_weight: z.number().min(0).optional().nullable(),
  tds: z.number().min(0).max(30).optional().nullable(),
  extraction_time: z.number().min(0).optional().nullable(), // durasi detik
  ratio_coffee_water: z.number().optional().nullable(),
  ratio_yield_coffee: z.number().optional().nullable(),
  sensory_profile: sensoryProfileSchema.optional().nullable(),
  overall_rating: z.number().min(0).max(5).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type LogBrewFormValues = z.infer<typeof logBrewSchema>;
