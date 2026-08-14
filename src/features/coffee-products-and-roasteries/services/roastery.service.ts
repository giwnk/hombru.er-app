"use server";

import { createServerSupabase } from "@/lib/supabase/supabase";
import { ROASTERY_MESSAGES } from "../constants/roastery.constant";
import { roasterySchema } from "../types/roastery.schema";
import { ActionResponse } from "@/shared/response.type";
import {
  CreateRoasteryPayload,
  Roastery,
  RoasteryParams,
  UpdateRoasteryPayload,
} from "../types/roastery.type";

export async function createRoastery(
  payload: CreateRoasteryPayload
): Promise<ActionResponse<Roastery>> {
  try {
    const validatedData = roasterySchema.safeParse(payload);
    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.issues[0]?.message || "Data roastery tidak valid.",
      };
    }

    const supabase = await createServerSupabase();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "Sesi telah berakhir. Silakan login kembali.",
      };
    }

    const { data: newRoastery, error: insertError } = await supabase
      .from("roasteries")
      .insert({
        ...validatedData.data,
        user_id: user.id,
      })
      .select("*")
      .single();

    if (insertError) {
      console.error("Insert Roastery Error:", insertError);
      return {
        success: false,
        error: insertError.message || ROASTERY_MESSAGES.ERROR.SERVER_ERROR,
      };
    }

    return {
      success: true,
      message: ROASTERY_MESSAGES.SUCCESS.CREATE,
      data: newRoastery as Roastery,
    };
  } catch (err) {
    console.error("createRoastery Error:", err);
    return {
      success: false,
      error: ROASTERY_MESSAGES.ERROR.SERVER_ERROR,
    };
  }
}

export async function getRoasteries(
  params?: RoasteryParams
): Promise<ActionResponse<Roastery[]>> {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let query = supabase.from("roasteries").select("*");

    if (user) {
      query = query.or(`user_id.eq.${user.id},user_id.is.null`);
    }

    if (params?.search && params.search.trim() !== "") {
      query = query.ilike("roastery_name", `%${params.search.trim()}%`);
    }

    if (params?.country) {
      query = query.eq("country", params.country);
    }

    const { data: roasteries, error: queryError } = await query;

    if (queryError) {
      console.error("getRoasteries DB Error:", queryError);
      // Fallback query tanpa filter opsional jika RLS/syntax mengembalikan error
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("roasteries")
        .select("*");

      if (fallbackError) {
        console.error("getRoasteries Fallback Error:", fallbackError);
        return {
          success: false,
          error: fallbackError.message || ROASTERY_MESSAGES.ERROR.SERVER_ERROR,
        };
      }

      return {
        success: true,
        data: (fallbackData as Roastery[]) || [],
      };
    }

    return {
      success: true,
      data: (roasteries as Roastery[]) || [],
    };
  } catch (err) {
    console.error("getRoasteries Exception:", err);
    return {
      success: false,
      error: ROASTERY_MESSAGES.ERROR.SERVER_ERROR,
    };
  }
}

export async function updateRoastery(
  payload: UpdateRoasteryPayload
): Promise<ActionResponse<Roastery>> {
  try {
    const { id, ...updateData } = payload;
    if (!id) return { success: false, error: "ID roastery tidak valid." };

    const validatedData = roasterySchema.partial().safeParse(updateData);
    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.issues[0]?.message || "Data tidak valid.",
      };
    }

    const supabase = await createServerSupabase();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "Sesi telah berakhir. Silakan login kembali.",
      };
    }

    const { data: updated, error: updateError } = await supabase
      .from("roasteries")
      .update(validatedData.data)
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      return {
        success: false,
        error: updateError.message || ROASTERY_MESSAGES.ERROR.SERVER_ERROR,
      };
    }

    return {
      success: true,
      message: ROASTERY_MESSAGES.SUCCESS.UPDATE,
      data: updated as Roastery,
    };
  } catch (err) {
    return {
      success: false,
      error: ROASTERY_MESSAGES.ERROR.SERVER_ERROR,
    };
  }
}

export async function deleteRoastery(
  id: string
): Promise<ActionResponse<null>> {
  try {
    if (!id) return { success: false, error: "ID roastery tidak valid." };

    const supabase = await createServerSupabase();
    const { error: deleteError } = await supabase
      .from("roasteries")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return {
        success: false,
        error: deleteError.message || ROASTERY_MESSAGES.ERROR.SERVER_ERROR,
      };
    }

    return {
      success: true,
      message: ROASTERY_MESSAGES.SUCCESS.DELETE,
    };
  } catch (err) {
    return {
      success: false,
      error: ROASTERY_MESSAGES.ERROR.SERVER_ERROR,
    };
  }
}
