import { z } from "zod";
import { RECIPE_MESSAGE } from "../constants/recipes.constant";

export const ingredientSchema = z.object({
  name: z.string().min(1, RECIPE_MESSAGE.ERROR.INGREDIENT_NAME_REQUIRED),
  amount: z
    .number({ message: "Jumlah bahan harus berupa angka" })
    .gte(0, RECIPE_MESSAGE.ERROR.INGREDIENT_AMOUNT_INVALID),
  unit: z.string().min(1, RECIPE_MESSAGE.ERROR.INGREDIENT_UNIT_REQUIRED),
  isImported: z.boolean().optional(),
  sourceBrewId: z.string().optional(),
});

export const recipeSchema = z.object({
  name: z
    .string()
    .min(1, RECIPE_MESSAGE.ERROR.NAME_REQUIRED)
    .max(50, RECIPE_MESSAGE.ERROR.NAME_MAX_LENGTH),
  description: z.string().optional().nullable(),
  method: z.string().min(1, RECIPE_MESSAGE.ERROR.METHOD_REQUIRED),
  instructions: z.string().optional().nullable(),
  ingredients: z.array(ingredientSchema).optional().nullable(),
  tool_ids: z.array(z.string()).optional().nullable(),
  log_brews_id: z.string().optional().nullable(),
});

export type RecipeFormInput = z.infer<typeof recipeSchema>;
export type IngredientFormInput = z.infer<typeof ingredientSchema>;