import z from "zod";
import { CP_MESSAGES } from "../constants/coffee-products.constant";

export const roasterySchema = z.object({
  roastery_name: z
    .string()
    .min(1, { message: CP_MESSAGES.ERROR.EMPTY_ROASTERY_NAME }),
  country: z.string().optional(),
  contact_info: z.string().optional(),
  roastery_score: z.coerce
    .number()
    .min(1, { message: CP_MESSAGES.ERROR.INVALID_ROASTERY_SCORE })
    .max(10, { message: CP_MESSAGES.ERROR.INVALID_ROASTERY_SCORE })
    .or(z.literal("").transform(() => undefined)),
  more_info: z.string().optional(),
});
