import { Roastery } from "./roastery.type";

import { ActionResponse } from "@/shared/response.type";

export type { ActionResponse };


export interface CoffeeProduct {
  id: string;
  user_id: string;
  roastery_id: string;
  product_name: string;
  roast_level?: string;
  flavour_profile?: string;
  weight?: number;
  roast_date?: string;
  cupping_score?: number;
  product_url?: string;
  product_image_url?: string;
  more_info?: string;
  country_of_origin?: string;
  region?: string;
  altitude?: number;
  varietal?: string;
  processing?: string;
  decaf?: boolean;
  price?: number;
  roastery?: Roastery;
  roasteries?: Roastery;
}

export type CreateProductPayload = Omit<
  CoffeeProduct,
  "id" | "user_id" | "roastery"
>;

export type UpdateProductPayload = Partial<CreateProductPayload> & {
  id: string;
};

export interface CoffeeProductParams {
  search?: string;
  roastery_id?: string;
  processing?: string;
  roast_level?: string;
  sort_by?: "product_name" | "cupping_score" | "weight";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}
