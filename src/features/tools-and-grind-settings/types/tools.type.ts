import { ToolType } from "../constants/tools.constant";
import { ActionResponse } from "@/shared/response.type";

export type { ActionResponse, ToolType };

export interface Tool {
  id: string;
  user_id: string;
  tool_type: ToolType;
  tool_name: string;
  brand: string;
  model?: string;
  notes?: string;
  created_at?: string;
}

export type CreateToolPayload = Omit<Tool, "id" | "user_id" | "created_at">;

export type UpdateToolPayload = Partial<CreateToolPayload> & {
  id: string;
};

export interface ToolParams {
  search?: string;
  tool_type?: ToolType;
  page?: number;
  limit?: number;
}
