import { z } from "zod";
import { TOOL_MESSAGE, TOOL_TYPE_VALUES } from "../constants/tools.constant";

export const toolsSchema = z.object({
  tool_name: z.string().min(1, { message: TOOL_MESSAGE.ERROR.NAME_REQUIRED }),
  tool_type: z.enum(TOOL_TYPE_VALUES, {
    message: TOOL_MESSAGE.ERROR.TOOL_TYPE_REQUIRED,
  }),
  brand: z
    .string()
    .min(1, { message: TOOL_MESSAGE.ERROR.BRAND_REQUIRED })
    .max(50, { message: TOOL_MESSAGE.ERROR.BRAND_MAX_LENGTH }),
  model: z
    .string()
    .max(50, { message: TOOL_MESSAGE.ERROR.MODEL_MAX_LENGTH })
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(250, { message: TOOL_MESSAGE.ERROR.NOTES_MAX_LENGTH })
    .optional()
    .or(z.literal("")),
});

export type ToolFormInput = z.infer<typeof toolsSchema>;
