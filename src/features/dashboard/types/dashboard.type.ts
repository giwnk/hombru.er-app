import { ActionResponse } from "@/shared/response.type";
import { LogBrew } from "@/features/log-brews/types/log-brews.types";
import { CoffeeProduct } from "@/features/coffee-products-and-roasteries/types/coffee-products.type";

export type { ActionResponse };

export interface MethodDistributionItem {
  method: string;
  count: number;
  percentage: number;
}

export interface SensoryAverages {
  sweetness: number;
  acidity: number;
  body: number;
  clarity: number;
  bitterness: number;
  aftertaste: number;
  profile_accuracy: number;
}

export interface DashboardStats {
  totalBrews: number;
  brewsThisMonth: number;
  totalBeans: number;
  favoriteBeanName: string | null;
  avgRating: number;
  avgProfileAccuracy: number;
  totalRecipes: number;
  topMethod: string | null;
  methodDistribution: MethodDistributionItem[];
  sensoryAverages: SensoryAverages;
  recentBrews: LogBrew[];
  activeBean: CoffeeProduct | null;
}
