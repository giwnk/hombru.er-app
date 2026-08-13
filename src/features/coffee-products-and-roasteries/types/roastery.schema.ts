import z from "zod";

export const roasterySchema = z.object({
  roastery_name: z.string().min(1, { message: "Nama roastery wajib diisi." }),
  country: z.string().optional(),
  contact_info: z.string().optional(),
  roastery_score: z.coerce
    .number()
    .min(1, { message: "Skor roastery minimal 1." })
    .max(10, { message: "Skor roastery maksimal 10." })
    .optional()
    .or(z.literal("").transform(() => undefined)),
  more_info: z.string().optional(),
});

export type RoasteryFormValues = z.infer<typeof roasterySchema>;
export type RoasteryFormInput = z.input<typeof roasterySchema>;
