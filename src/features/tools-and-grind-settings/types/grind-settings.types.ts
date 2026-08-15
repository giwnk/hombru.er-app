import { ActionResponse } from "@/shared/response.type";
import { GrindCategory } from "../constants/grind-settings.constant";

export type { ActionResponse };

export interface GrindSettings {
  id: string;
  user_id: string;
  tool_id: string;
  category: GrindCategory;
  min_value?: string | null;
  max_value?: string | null;
  created_at?: string;
}

export interface GrindSettingItemPayload {
  category: GrindCategory;
  min_value?: string;
  max_value?: string;
}
// 3. Payload Bulk Save (Mengirim 7 Kategori Sekaligus)
export interface SaveGrindSettingsPayload {
  tool_id: string;
  settings: GrindSettingItemPayload[];
}