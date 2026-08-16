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
 * 1. Ambil Semua Metode Penuangan (Selalu Menyertakan Preset Bawaan Sistem + Data Custom User)
 */
export async function getPouringMethods(
  params?: PouringMethodParams
): Promise<ActionResponse<PouringMethod[]>> {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let userMethods: PouringMethod[] = [];

    if (user) {
      const { data: dbMethods, error: fetchError } = await supabase
        .from("pouring_methods")
        .select("*")
        .eq("user_id", user.id)
        .order("id", { ascending: false });

      if (!fetchError && dbMethods) {
        userMethods = dbMethods as PouringMethod[];
      }

      // Cek apakah ada DEFAULT_POURING_PRESETS yang belum di-seed ke database user
      const existingNames = new Set(userMethods.map((m) => m.pour_name));
      const missingPresets = DEFAULT_POURING_PRESETS.filter(
        (p) => !existingNames.has(p.pour_name)
      );

      if (missingPresets.length > 0) {
        const presetsToInsert = missingPresets.map((p) => ({
          user_id: user.id,
          pour_name: p.pour_name,
          description: p.description,
          intervals: p.intervals,
        }));

        const { data: seededData, error: seedErr } = await supabase
          .from("pouring_methods")
          .insert(presetsToInsert)
          .select();

        if (seedErr) {
          console.error("auto-seed DB Error:", seedErr);
        }

        if (seededData && seededData.length > 0) {
          userMethods = [...userMethods, ...(seededData as PouringMethod[])];
        }
      }
    }

    // Safety Net: Jika masih ada preset yang belum ter-seed/termuat, sertakan secara virtual dari memori
    const existingNamesFinal = new Set(userMethods.map((m) => m.pour_name));
    const fallbackPresets: PouringMethod[] = DEFAULT_POURING_PRESETS.filter(
      (p) => !existingNamesFinal.has(p.pour_name)
    ).map((preset, index) => ({
      id: `preset-${index + 1}`,
      user_id: null,
      pour_name: preset.pour_name,
      description: preset.description,
      intervals: [...preset.intervals],
      is_system_template: true,
    }));

    let allMethods: PouringMethod[] = [...userMethods, ...fallbackPresets];

    // Filter jika ada pencarian kata kunci
    if (params?.search && params.search.trim() !== "") {
      const searchLower = params.search.trim().toLowerCase();
      allMethods = allMethods.filter(
        (m) =>
          m.pour_name.toLowerCase().includes(searchLower) ||
          m.description?.toLowerCase().includes(searchLower)
      );
    }

    return {
      success: true,
      message: POURING_METHOD_MESSAGE.SUCCESS.FETCH_SUCCESS,
      data: allMethods,
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
  id: string | number
): Promise<ActionResponse<PouringMethod>> {
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

    const { data, error } = await supabase
      .from("pouring_methods")
      .select("*")
      .eq("id", id)
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
  id: string | number
): Promise<ActionResponse<null>> {
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
