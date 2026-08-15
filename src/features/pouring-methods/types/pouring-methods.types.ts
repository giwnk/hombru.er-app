import { ActionResponse } from "@/shared/response.type";

export type { ActionResponse };

export interface PourInterval {
  step: number;
  target_water: number;
  duration_seconds?: number;
  notes?: string;
}

export interface PouringMethod {
  id: number;
  created_at?: string;
  user_id?: string | null;
  pour_name: string;
  description?: string | null;
  intervals: PourInterval[];
  is_system_template?: boolean;
}

export type CreatePouringMethodPayload = Omit<
  PouringMethod,
  "id" | "created_at" | "user_id" | "is_system_template"
>;

export type UpdatePouringMethodPayload = Partial<CreatePouringMethodPayload> & {
  id: number;
};

export interface PouringMethodParams {
  search?: string;
  page?: number;
  limit?: number;
}
