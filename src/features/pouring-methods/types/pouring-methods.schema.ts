import { z } from "zod";
import { POURING_METHOD_MESSAGE } from "../constants/pouring-methods.constant";

export const pourIntervalSchema = z.object({
  step: z.number().min(1),
  target_water: z
    .number({
      message: POURING_METHOD_MESSAGE.ERROR.TARGET_WATER_REQUIRED,
    })
    .min(1, {
      message: POURING_METHOD_MESSAGE.ERROR.TARGET_WATER_REQUIRED,
    }),
  duration_seconds: z.number().min(0).optional(),
  notes: z.string().max(100).optional().or(z.literal("")),
});

export const pouringMethodSchema = z.object({
  pour_name: z
    .string()
    .min(1, { message: POURING_METHOD_MESSAGE.ERROR.NAME_REQUIRED })
    .max(50, { message: POURING_METHOD_MESSAGE.ERROR.NAME_MAX_LENGTH }),
  description: z.string().optional().or(z.literal("")),
  intervals: z
    .array(pourIntervalSchema)
    .min(1, { message: POURING_METHOD_MESSAGE.ERROR.INTERVALS_REQUIRED }),
});

export type PourIntervalInput = z.infer<typeof pourIntervalSchema>;
export type PouringMethodFormInput = z.infer<typeof pouringMethodSchema>;
