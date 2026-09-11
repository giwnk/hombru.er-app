import { Tool } from "@/features/tools-and-grind-settings/types/tools.type";
import { ActionResponse } from "@/shared/response.type";

export type { ActionResponse };

export interface Ingredient {
  name: string;
  unit: string; // Satuan seperti "g", "ml", "oz", "pump", "shot"
  amount: number;
  isImported?: boolean;
  sourceBrewId?: string;
}

export interface Recipe {
  id: string; // uuid di Supabase
  created_at?: string; // timestamptz di Supabase
  user_id?: string | null; // uuid di Supabase (NULLABLE)
  name: string;
  description?: string | null;
  method?: string | null;
  instructions?: string | null;
  ingredients?: Ingredient[] | null; // jsonb di Supabase
  tool_ids?: string[] | null; // jsonb di Supabase (Array ID alat seduh)
  tools?: Tool[]; // Populated Tool objects (Opsional untuk UI)
  log_brews_id?: string | null; // uuid di Supabase (Single UUID string)
}

export type CreateRecipePayload = Omit<
  Recipe,
  "id" | "created_at" | "user_id" | "tools"
>;

export type UpdateRecipePayload = Partial<CreateRecipePayload> & {
  id: string;
};

export interface RecipeParams {
  search?: string;
  method?: string;
  page?: number;
  limit?: number;
}