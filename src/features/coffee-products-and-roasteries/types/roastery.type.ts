
export interface Roastery {
  id: string;
  roastery_name: string;
  name?: string;
  country?: string;
  contact_info?: string;
  roastery_score?: number;
  more_info?: string;
  created_at?: string;
}

export type CreateRoasteryPayload = Omit<Roastery, "id" | "created_at">;

export type UpdateRoasteryPayload = Partial<CreateRoasteryPayload> & {
  id: string;
};

export interface RoasteryParams {
  search?: string;
  country?: string;
  sort_by?: "roastery_name" | "roastery_score" | "created_at";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}
