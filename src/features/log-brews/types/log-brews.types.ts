import { ActionResponse } from "@/shared/response.type";
import { CoffeeProduct } from "@/features/coffee-products-and-roasteries/types/coffee-products.type";
import { Tool } from "@/features/tools-and-grind-settings/types/tools.type";
import { PouringMethod } from "@/features/pouring-methods/types/pouring-methods.types";

export type { ActionResponse };

/**
 * Profil Sensori Seduhan (Sensory Profile JSONB)
 * Seluruh atribut menggunakan skala numeric slider (misal 1 - 5 / 1 - 10)
 * termasuk `profile_accuracy` untuk mengukur akurasi profil rasa dibanding ekspetasi.
 */
export interface SensoryProfile {
  sweetness?: number; // Slider skala 1 - 5
  acidity?: number; // Slider skala 1 - 5
  body?: number; // Slider skala 1 - 5
  clarity?: number; // Slider skala 1 - 5
  bitterness?: number; // Slider skala 1 - 5
  aftertaste?: number; // Slider skala 1 - 5
  profile_accuracy?: number; // Slider skala 1 - 5 / 1 - 10 (Akurasi Profil Rasa)
}

/**
 * Interface Utama Tabel `log_brews`
 */
export interface LogBrew {
  id: string;
  user_id: string;
  bean_id: string;
  method: string;
  tool_ids?: string[] | null;
  grind_setting_id?: string | null;
  grind_size_actual?: string | null;
  coffee_weight: number;
  water_weight: number;
  temperature?: number | null;
  pouring_method_id?: string | null;
  yield_weight?: number | null;
  tds?: number | null;
  extraction_time?: number | null; // dalam detik
  ratio_coffee_water?: number | null;
  ratio_yield_coffee?: number | null;
  sensory_profile?: SensoryProfile | null;
  overall_rating?: number | null;
  notes?: string | null;
  created_at?: string;

  // Joined Relational Objects (Populasi opsional saat query JOIN)
  bean?: CoffeeProduct;
  pouring_method?: PouringMethod;
  tools?: Tool[];
}

export type CreateLogBrewPayload = Omit<
  LogBrew,
  "id" | "user_id" | "created_at" | "bean" | "pouring_method" | "tools"
>;

export type UpdateLogBrewPayload = Partial<CreateLogBrewPayload> & {
  id: string;
};

export interface LogBrewParams {
  search?: string;
  bean_id?: string;
  method?: string;
  min_rating?: number;
  start_date?: string;
  end_date?: string;
  sort_by?: "created_at" | "overall_rating" | "coffee_weight";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}
