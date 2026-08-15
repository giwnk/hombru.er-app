"use server";

import { createServerSupabase } from "@/lib/supabase/supabase";
import { ActionResponse } from "@/shared/response.type";
import {
  DEFAULT_POURING_PRESETS,
  POURING_METHOD_MESSAGE,
} from "../constants/pouring-methods.constant";
import { pouringMethodSchema } from "../types/pouring-methods.schema";
import {
  CreatePouringMethodPayload,
  PouringMethod,
  PouringMethodParams,
  UpdatePouringMethodPayload,
} from "../types/pouring-methods.types";

/**
 * 1. Ambil Semua Metode Penuangan (Menggabungkan Template Bawaan Sistem + Data Custom User)
 */
export async function getPouringMethods(
  params?: PouringMethodParams
): Promise<ActionResponse<PouringMethod[]>> {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: POURING_METHOD_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    // Query data milik user dari Supabase
    let query = supabase
      .from("pouring_methods")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });

    if (params?.search && params.search.trim() !== "") {
      query = query.ilike("pour_name", `%${params.search.trim()}%`);
    }

    const { data: userMethods, error: fetchError } = await query;

    if (fetchError) {
      console.error("getPouringMethods DB Error:", fetchError);
      return {
        success: false,
        error: POURING_METHOD_MESSAGE.ERROR.FETCH_FAILED,
      };
    }

    // Format 2 Template Bawaan Sistem (Preset Hints Cara A)
    const systemPresets: PouringMethod[] = DEFAULT_POURING_PRESETS.map(
      (preset, index) => ({
        id: -(index + 1), // Virtual negative ID untuk template sistem
        user_id: null,
        pour_name: preset.pour_name,
        description: preset.description,
        intervals: [...preset.intervals],
        is_system_template: true,
      })
    );

    // Filter preset jika user sedang melakukan pencarian
    const filteredPresets = params?.search?.trim()
      ? systemPresets.filter(
          (p) =>
            p.pour_name.toLowerCase().includes(params.search!.toLowerCase()) ||
            p.description?.toLowerCase().includes(params.search!.toLowerCase())
        )
      : systemPresets;

    // Gabungkan: User custom methods ditaruh di depan, diikuti template sistem
    const combinedMethods: PouringMethod[] = [
      ...(userMethods || []),
      ...filteredPresets,
    ];

    return {
      success: true,
      message: POURING_METHOD_MESSAGE.SUCCESS.FETCH_SUCCESS,
      data: combinedMethods,
    };
  } catch (error) {
    console.error("getPouringMethods Exception:", error);
    return {
      success: false,
      error: POURING_METHOD_MESSAGE.ERROR.UNKNOWN_ERROR,
    };
  }
}

/**
 * 2. Ambil Metode Penuangan Berdasarkan ID
 */
export async function getPouringMethodById(
  id: number
): Promise<ActionResponse<PouringMethod>> {
  try {
    // Jika ID negatif, return dari DEFAULT_POURING_PRESETS
    if (id < 0) {
      const presetIndex = Math.abs(id) - 1;
      const preset = DEFAULT_POURING_PRESETS[presetIndex];
      if (preset) {
        return {
          success: true,
          message: POURING_METHOD_MESSAGE.SUCCESS.FETCH_SUCCESS,
          data: {
            id,
            user_id: null,
            pour_name: preset.pour_name,
            description: preset.description,
            intervals: [...preset.intervals],
            is_system_template: true,
          },
        };
      }
    }

    const supabase = await createServerSupabase();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: POURING_METHOD_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    const { data, error } = await supabase
      .from("pouring_methods")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return {
        success: false,
        error: POURING_METHOD_MESSAGE.ERROR.NOT_FOUND,
      };
    }

    return {
      success: true,
      message: POURING_METHOD_MESSAGE.SUCCESS.FETCH_SUCCESS,
      data,
    };
  } catch (error) {
    console.error("getPouringMethodById Exception:", error);
    return {
      success: false,
      error: POURING_METHOD_MESSAGE.ERROR.UNKNOWN_ERROR,
    };
  }
}

/**
 * 3. Tambah Metode Penuangan Baru
 */
export async function createPouringMethod(
  payload: CreatePouringMethodPayload
): Promise<ActionResponse<PouringMethod>> {
  try {
    const validatedData = pouringMethodSchema.safeParse(payload);
    if (!validatedData.success) {
      return {
        success: false,
        error:
          validatedData.error.issues[0]?.message ||
          POURING_METHOD_MESSAGE.ERROR.CREATE_FAILED,
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
        error: POURING_METHOD_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    const { data, error } = await supabase
      .from("pouring_methods")
      .insert({
        user_id: user.id,
        pour_name: validatedData.data.pour_name.trim(),
        description: validatedData.data.description?.trim() || null,
        intervals: validatedData.data.intervals,
      })
      .select()
      .single();

    if (error) {
      console.error("createPouringMethod DB Error:", error);
      return {
        success: false,
        error: error.message || POURING_METHOD_MESSAGE.ERROR.CREATE_FAILED,
      };
    }

    return {
      success: true,
      message: POURING_METHOD_MESSAGE.SUCCESS.CREATE_SUCCESS,
      data,
    };
  } catch (error) {
    console.error("createPouringMethod Exception:", error);
    return {
      success: false,
      error: POURING_METHOD_MESSAGE.ERROR.UNKNOWN_ERROR,
    };
  }
}

/**
 * 4. Perbarui Metode Penuangan
 */
export async function updatePouringMethod(
  payload: UpdatePouringMethodPayload
): Promise<ActionResponse<PouringMethod>> {
  try {
    const { id, ...updateFields } = payload;
    if (!id || id < 0) {
      return {
        success: false,
        error: "Template bawaan sistem tidak dapat diubah secara langsung.",
      };
    }

    const validatedData = pouringMethodSchema.safeParse(updateFields);
    if (!validatedData.success) {
      return {
        success: false,
        error:
          validatedData.error.issues[0]?.message ||
          POURING_METHOD_MESSAGE.ERROR.UPDATE_FAILED,
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
        error: POURING_METHOD_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    const { data, error } = await supabase
      .from("pouring_methods")
      .update({
        pour_name: validatedData.data.pour_name.trim(),
        description: validatedData.data.description?.trim() || null,
        intervals: validatedData.data.intervals,
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("updatePouringMethod DB Error:", error);
      return {
        success: false,
        error: error.message || POURING_METHOD_MESSAGE.ERROR.UPDATE_FAILED,
      };
    }

    return {
      success: true,
      message: POURING_METHOD_MESSAGE.SUCCESS.UPDATE_SUCCESS,
      data,
    };
  } catch (error) {
    console.error("updatePouringMethod Exception:", error);
    return {
      success: false,
      error: POURING_METHOD_MESSAGE.ERROR.UNKNOWN_ERROR,
    };
  }
}

/**
 * 5. Hapus Metode Penuangan
 */
export async function deletePouringMethod(
  id: number
): Promise<ActionResponse<null>> {
  try {
    if (!id || id < 0) {
      return {
        success: false,
        error: "Template bawaan sistem tidak dapat dihapus.",
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
        error: POURING_METHOD_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    const { error } = await supabase
      .from("pouring_methods")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("deletePouringMethod DB Error:", error);
      return {
        success: false,
        error: error.message || POURING_METHOD_MESSAGE.ERROR.DELETE_FAILED,
      };
    }

    return {
      success: true,
      message: POURING_METHOD_MESSAGE.SUCCESS.DELETE_SUCCESS,
    };
  } catch (error) {
    console.error("deletePouringMethod Exception:", error);
    return {
      success: false,
      error: POURING_METHOD_MESSAGE.ERROR.UNKNOWN_ERROR,
    };
  }
}
