import { z } from "zod";
import { CP_MESSAGES } from "../constants/coffee-products.constant";

export const coffeeProductsSchema = z.object({
  product_name: z
    .string()
    .min(1, { message: CP_MESSAGES.ERROR.EMPTY_PRODUCT_NAME }),
  roastery_id: z
    .string()
    .min(1, { message: CP_MESSAGES.ERROR.ROASTERY_UNSELECTED }),
  roast_level: z.string().optional(),
  flavour_profile: z.string().optional(),
  weight: z.coerce
    .number()
    .positive({ message: CP_MESSAGES.ERROR.INVALID_WEIGHT })
    .optional()
    .or(z.literal("").transform(() => undefined)),
  roast_date: z.string().optional(),
  cupping_score: z.coerce
    .number()
    .min(75, { message: CP_MESSAGES.ERROR.INVALID_CUPPING_SCORE })
    .max(100, { message: CP_MESSAGES.ERROR.INVALID_CUPPING_SCORE })
    .optional()
    .or(z.literal("").transform(() => undefined)),
  product_url: z
    .string()
    .url({ message: CP_MESSAGES.ERROR.INVALID_URL })
    .optional()
    .or(z.literal("")),
  product_image_url: z
    .string()
    .url({ message: CP_MESSAGES.ERROR.INVALID_URL })
    .optional()
    .or(z.literal("")),
  more_info: z.string().optional(),
  country_of_origin: z.string().optional(),
  region: z.string().optional(),
  altitude: z.coerce
    .number()
    .positive({ message: CP_MESSAGES.ERROR.INVALID_ALTITUDE })
    .optional()
    .or(z.literal("").transform(() => undefined)),
  varietal: z.string().optional(),
  processing: z.string().optional(),
  decaf: z.boolean().optional().default(false),
  price: z.coerce
    .number()
    .positive({ message: CP_MESSAGES.ERROR.INVALID_PRICE })
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type CoffeeProductsFormInput = z.input<typeof coffeeProductsSchema>;
export type CoffeeProductsFormValues = z.infer<typeof coffeeProductsSchema>;

