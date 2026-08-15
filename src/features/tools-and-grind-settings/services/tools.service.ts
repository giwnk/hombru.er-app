"use server";

import { createServerSupabase } from "@/lib/supabase/supabase";
import { TOOL_MESSAGE } from "../constants/tools.constant";
import { toolsSchema } from "../types/tools.schema";
import { ActionResponse } from "@/shared/response.type";
import {
  CreateToolPayload,
  Tool,
  ToolParams,
  UpdateToolPayload,
} from "../types/tools.type";

/**
 * 1. Create Tool Baru
 */
export async function createTool(
  payload: CreateToolPayload
): Promise<ActionResponse<Tool>> {
  try {
    // 1. Validasi input menggunakan Zod schema
    const validatedData = toolsSchema.safeParse(payload);
    if (!validatedData.success) {
      const firstErrorMessage =
        validatedData.error.issues[0]?.message ||
        "Data yang dimasukkan tidak valid.";
      return {
        success: false,
        error: firstErrorMessage,
      };
    }

    // 2. Inisialisasi Supabase Server Client & Cek Auth User
    const supabase = await createServerSupabase();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: TOOL_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    // 3. Sanitasi string kosong ("") menjadi null
    const sanitizedData = Object.fromEntries(
      Object.entries(validatedData.data).map(([key, value]) => [
        key,
        value === "" ? null : value,
      ])
    );

    // 4. Insert data ke tabel "tools"
    const { data: newTool, error: insertError } = await supabase
      .from("tools")
      .insert({
        ...sanitizedData,
        user_id: user.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert Tool DB Error:", insertError);
      return {
        success: false,
        error: insertError.message || TOOL_MESSAGE.ERROR.CREATE_FAILED,
      };
    }

    // 5. Kembalikan respons sukses
    return {
      success: true,
      message: TOOL_MESSAGE.SUCCESS.CREATE_SUCCESS,
      data: newTool as Tool,
    };
  } catch (error) {
    console.error("createTool Error:", error);
    return {
      success: false,
      error: TOOL_MESSAGE.ERROR.UNKNOWN_ERROR,
    };
  }
}

/**
 * 2. Get Daftar Tools (dengan Filter & Search)
 */
export async function getTools(
  params?: ToolParams
): Promise<ActionResponse<Tool[]>> {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let query = supabase.from("tools").select("*");
    if (user) {
      query = query.or(`user_id.eq.${user.id},user_id.is.null`);
    }

    if (params?.search && params.search.trim() !== "") {
      query = query.or(
        `tool_name.ilike.%${params.search.trim()}%,brand.ilike.%${params.search.trim()}%`
      );
    }

    if (params?.tool_type) {
      query = query.eq("tool_type", params.tool_type);
    }

    // Default sorting dari yang terbaru
    query = query.order("created_at", { ascending: false });

    const { data: tools, error: queryError } = await query;

    if (queryError) {
      console.error("getTools DB Error:", queryError);
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("tools")
        .select("*")
        .order("created_at", { ascending: false });

      if (fallbackError) {
        console.error("getTools Fallback Error:", fallbackError);
        return {
          success: false,
          error: fallbackError.message || TOOL_MESSAGE.ERROR.SERVER_ERROR,
        };
      }
      return {
        success: true,
        data: (fallbackData as Tool[]) || [],
      };
    }

    return {
      success: true,
      data: (tools as Tool[]) || [],
    };
  } catch (err) {
    console.error("getTools Exception:", err);
    return {
      success: false,
      error: TOOL_MESSAGE.ERROR.UNKNOWN_ERROR,
    };
  }
}

// Alias getTool ke getTools
export const getTool = getTools;

/**
 * 3. Get Tool Berdasarkan ID
 */
export async function getToolById(
  id: string
): Promise<ActionResponse<Tool>> {
  try {
    if (!id || id.trim() === "") {
      return {
        success: false,
        error: TOOL_MESSAGE.ERROR.INVALID_ID,
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
        error: TOOL_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    const { data: toolData, error: dataError } = await supabase
      .from("tools")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (dataError || !toolData) {
      return {
        success: false,
        error: TOOL_MESSAGE.ERROR.NOT_FOUND,
      };
    }

    return {
      success: true,
      data: toolData as Tool,
    };
  } catch (error) {
    console.error("getToolById Error:", error);
    return {
      success: false,
      error: TOOL_MESSAGE.ERROR.UNKNOWN_ERROR,
    };
  }
}

/**
 * 4. Update Tool
 */
export async function updateTool(
  payload: UpdateToolPayload
): Promise<ActionResponse<Tool>> {
  try {
    const { id, ...updateData } = payload;

    if (!id || id.trim() === "") {
      return {
        success: false,
        error: TOOL_MESSAGE.ERROR.INVALID_ID,
      };
    }

    const validatedData = toolsSchema.partial().safeParse(updateData);
    if (!validatedData.success) {
      const firstErrorMessage =
        validatedData.error.issues[0]?.message ||
        "Data yang dimasukkan tidak valid.";
      return {
        success: false,
        error: firstErrorMessage,
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
        error: TOOL_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    const sanitizedUpdateData = Object.fromEntries(
      Object.entries(validatedData.data).map(([key, value]) => [
        key,
        value === "" ? null : value,
      ])
    );

    const { data: updatedTool, error: updateError } = await supabase
      .from("tools")
      .update(sanitizedUpdateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("updateTool DB Error:", updateError);
      return {
        success: false,
        error: updateError.message || TOOL_MESSAGE.ERROR.UPDATE_FAILED,
      };
    }

    return {
      success: true,
      message: TOOL_MESSAGE.SUCCESS.UPDATE_SUCCESS,
      data: updatedTool as Tool,
    };
  } catch (error) {
    console.error("updateTool Error:", error);
    return {
      success: false,
      error: TOOL_MESSAGE.ERROR.UNKNOWN_ERROR,
    };
  }
}

/**
 * 5. Delete Tool
 */
export async function deleteTool(
  id: string
): Promise<ActionResponse<null>> {
  try {
    if (!id || id.trim() === "") {
      return {
        success: false,
        error: TOOL_MESSAGE.ERROR.INVALID_ID,
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
        error: TOOL_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    const { error: deleteError } = await supabase
      .from("tools")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("deleteTool DB Error:", deleteError);
      return {
        success: false,
        error: deleteError.message || TOOL_MESSAGE.ERROR.DELETE_FAILED,
      };
    }

    return {
      success: true,
      message: TOOL_MESSAGE.SUCCESS.DELETE_SUCCESS,
    };
  } catch (error) {
    console.error("deleteTool Error:", error);
    return {
      success: false,
      error: TOOL_MESSAGE.ERROR.UNKNOWN_ERROR,
    };
  }
}