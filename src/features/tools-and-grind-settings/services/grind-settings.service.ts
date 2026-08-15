"use server";

import { createServerSupabase } from "@/lib/supabase/supabase";
import { ActionResponse } from "@/shared/response.type";
import {
  GRIND_CATEGORIES,
  GRIND_SETTINGS_MESSAGE,
} from "../constants/grind-settings.constant";
import { grindSettingsFormSchema } from "../types/grind-settings.schema";
import {
  GrindSettings,
  SaveGrindSettingsPayload,
} from "../types/grind-settings.types";

/**
 * 1. Ambil Data Kalibrasi Gilingan berdasarkan Tool ID (Selalu mengembalikan 7 baris kategori)
 */
export async function getGrindSettingsByToolId(
  toolId: string
): Promise<ActionResponse<GrindSettings[]>> {
  try {
    if (!toolId || toolId.trim() === "") {
      return {
        success: false,
        error: GRIND_SETTINGS_MESSAGE.ERROR.INVALID_TOOL_ID,
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
        error: GRIND_SETTINGS_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    const { data: dataGrindSet, error: errorGrindSet } = await supabase
      .from("grind_settings")
      .select("*")
      .eq("tool_id", toolId)
      .eq("user_id", user.id);

    if (errorGrindSet) {
      console.error("getGrindSettingsByToolId Error:", errorGrindSet);
      return {
        success: false,
        error: GRIND_SETTINGS_MESSAGE.ERROR.FETCH_FAILED,
      };
    }

    // Mapping terhadap 7 GRIND_CATEGORIES statis agar di UI selalu mengembalikan 7 baris kategori
    const formattedSettings: GrindSettings[] = GRIND_CATEGORIES.map(
      (category) => {
        const existing = (dataGrindSet || []).find(
          (item) => item.category === category
        );

        return {
          id: existing?.id || "",
          tool_id: toolId,
          user_id: user.id,
          category: category,
          min_value: existing?.min_value || "",
          max_value: existing?.max_value || "",
          created_at: existing?.created_at,
        };
      }
    );

    return {
      success: true,
      message: GRIND_SETTINGS_MESSAGE.SUCCESS.FETCH_SUCCESS,
      data: formattedSettings,
    };
  } catch (error) {
    console.error("getGrindSettingsByToolId Exception:", error);
    return {
      success: false,
      error: GRIND_SETTINGS_MESSAGE.ERROR.UNKNOWN_ERROR,
    };
  }
}

/**
 * 2. Simpan / Bulk Upsert Kalibrasi Gilingan (7 Kategori Sekaligus)
 */
export async function saveGrindSettings(
  payload: SaveGrindSettingsPayload
): Promise<ActionResponse<null>> {
  try {
    // 1. Validasi Zod Schema
    const validatedData = grindSettingsFormSchema.safeParse(payload);
    if (!validatedData.success) {
      const firstErrorMessage =
        validatedData.error.issues[0]?.message ||
        "Data kalibrasi gilingan yang dimasukkan tidak valid.";
      return {
        success: false,
        error: firstErrorMessage,
      };
    }

    // 2. Inisialisasi Supabase Server Client & Cek User Auth
    const supabase = await createServerSupabase();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: GRIND_SETTINGS_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    // 3. Filter & Format payload bulk untuk 7 kategori
    const validSettingsToInsert = validatedData.data.settings
      .map((item) => ({
        tool_id: validatedData.data.tool_id,
        user_id: user.id,
        category: item.category,
        min_value:
          item.min_value && item.min_value.trim() !== ""
            ? item.min_value.trim()
            : null,
        max_value:
          item.max_value && item.max_value.trim() !== ""
            ? item.max_value.trim()
            : null,
      }))
      .filter((item) => item.min_value !== null || item.max_value !== null);

    // 4. Coba jalankan Upsert terlebih dahulu
    const allFormattedSettings = validatedData.data.settings.map((item) => ({
      tool_id: validatedData.data.tool_id,
      user_id: user.id,
      category: item.category,
      min_value:
        item.min_value && item.min_value.trim() !== ""
          ? item.min_value.trim()
          : null,
      max_value:
        item.max_value && item.max_value.trim() !== ""
          ? item.max_value.trim()
          : null,
    }));

    const { error: upsertError } = await supabase
      .from("grind_settings")
      .upsert(allFormattedSettings, { onConflict: "tool_id, category" });

    // 5. Jika error constraint unik terjadi, gunakan Fallback (Delete + Insert)
    if (upsertError) {
      console.warn(
        "Upsert constraint error, fallback to Delete + Insert strategy:",
        upsertError.message
      );

      // Step A: Hapus kalibrasi lama untuk tool ini
      const { error: deleteError } = await supabase
        .from("grind_settings")
        .delete()
        .eq("tool_id", validatedData.data.tool_id)
        .eq("user_id", user.id);

      if (deleteError) {
        console.error("saveGrindSettings Fallback Delete Error:", deleteError);
        return {
          success: false,
          error: deleteError.message || GRIND_SETTINGS_MESSAGE.ERROR.SAVE_FAILED,
        };
      }

      // Step B: Insert item kalibrasi baru yang tidak kosong
      if (validSettingsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from("grind_settings")
          .insert(validSettingsToInsert);

        if (insertError) {
          console.error("saveGrindSettings Fallback Insert Error:", insertError);
          return {
            success: false,
            error: insertError.message || GRIND_SETTINGS_MESSAGE.ERROR.SAVE_FAILED,
          };
        }
      }
    }

    // 6. Return Success Response
    return {
      success: true,
      message: GRIND_SETTINGS_MESSAGE.SUCCESS.SAVE_SUCCESS,
    };
  } catch (error) {
    console.error("saveGrindSettings Exception:", error);
    return {
      success: false,
      error: GRIND_SETTINGS_MESSAGE.ERROR.UNKNOWN_ERROR,
    };
  }
}

/**
 * 3. Reset / Hapus Semua Kalibrasi Gilingan berdasarkan Tool ID
 */
export async function resetGrindSettings(
  toolId: string
): Promise<ActionResponse<null>> {
  try {
    if (!toolId || toolId.trim() === "") {
      return {
        success: false,
        error: GRIND_SETTINGS_MESSAGE.ERROR.INVALID_TOOL_ID,
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
        error: GRIND_SETTINGS_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    const { error: deleteError } = await supabase
      .from("grind_settings")
      .delete()
      .eq("tool_id", toolId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("resetGrindSettings DB Error:", deleteError);
      return {
        success: false,
        error: deleteError.message || GRIND_SETTINGS_MESSAGE.ERROR.RESET_FAILED,
      };
    }

    return {
      success: true,
      message: GRIND_SETTINGS_MESSAGE.SUCCESS.RESET_SUCCESS,
    };
  } catch (error) {
    console.error("resetGrindSettings Exception:", error);
    return {
      success: false,
      error: GRIND_SETTINGS_MESSAGE.ERROR.UNKNOWN_ERROR,
    };
  }
}
