"use server";

import { createServerSupabase } from "@/lib/supabase/supabase";
import {
  ActionResponse,
  CreateLogBrewPayload,
  LogBrew,
  LogBrewParams,
  UpdateLogBrewPayload,
} from "../types/log-brews.types";
import { LOG_BREWS_MESSAGE } from "../constants/log-brews.constant";
import { logBrewSchema } from "../types/log-brews.schema";
import { calculateBrewratio, calculateYieldRatio } from "../hooks/useCalculate";
import { CoffeeProduct } from "@/features/coffee-products-and-roasteries/types/coffee-products.type";
import { Tool } from "@/features/tools-and-grind-settings/types/tools.type";
import { PouringMethod } from "@/features/pouring-methods/types/pouring-methods.types";
import { GrindSettings } from "@/features/tools-and-grind-settings/types/grind-settings.types";
import { GRIND_CATEGORIES } from "@/features/tools-and-grind-settings/constants/grind-settings.constant";
import { getPouringMethods } from "@/features/pouring-methods/services/pouring-methods.service";

/**
 * 1. Tambah Catatan Seduh Baru
 */
export async function createLogBrew(
  payload: CreateLogBrewPayload
): Promise<ActionResponse<LogBrew>> {
  try {
    const validatedData = logBrewSchema.safeParse(payload);
    if (!validatedData.success) {
      return {
        success: false,
        error:
          validatedData.error.issues[0]?.message ||
          LOG_BREWS_MESSAGE.ERROR.CREATE_FAILED,
      };
    }

    const supabase = await createServerSupabase();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      return {
        success: false,
        error: LOG_BREWS_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    const coffeeWeight = validatedData.data.coffee_weight;
    const waterWeight = validatedData.data.water_weight;
    const yieldWeight = validatedData.data.yield_weight;

    const ratioCoffeeWater =
      validatedData.data.ratio_coffee_water ??
      calculateBrewratio(coffeeWeight, waterWeight);

    const ratioYieldCoffee =
      validatedData.data.ratio_yield_coffee ??
      (yieldWeight ? calculateYieldRatio(coffeeWeight, yieldWeight) : null);

    // Sanitasi UUID pouring_method_id (jika string kosong, set ke null)
    const pouringMethodId =
      validatedData.data.pouring_method_id &&
      validatedData.data.pouring_method_id.trim() !== ""
        ? validatedData.data.pouring_method_id.trim()
        : null;

    const { data, error } = await supabase
      .from("log_brews")
      .insert({
        ...validatedData.data,
        pouring_method_id: pouringMethodId,
        user_id: user.id,
        ratio_coffee_water: ratioCoffeeWater,
        ratio_yield_coffee: ratioYieldCoffee,
      })
      .select("*, bean:coffee_products(*, roasteries(*)), pouring_method:pouring_methods(*)")
      .single();

    if (error || !data) {
      console.error("createLogBrew DB Error:", error);
      return {
        success: false,
        error: error?.message || LOG_BREWS_MESSAGE.ERROR.CREATE_FAILED,
      };
    }

    return {
      success: true,
      message: LOG_BREWS_MESSAGE.SUCCESS.CREATE_SUCCESS,
      data: data as LogBrew,
    };
  } catch (error) {
    console.error("createLogBrew Exception:", error);
    return {
      success: false,
      error: LOG_BREWS_MESSAGE.ERROR.SERVER_ERROR,
    };
  }
}

/**
 * 2. Ambil Daftar Jurnal Seduhan (dengan Filter, Search, Sort & Join Biji Kopi + Metode Penuangan + Alat)
 */
export async function getLogBrews(
  params?: LogBrewParams
): Promise<ActionResponse<LogBrew[]>> {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      return {
        success: false,
        error: LOG_BREWS_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    let query = supabase
      .from("log_brews")
      .select("*, bean:coffee_products(*, roasteries(*)), pouring_method:pouring_methods(*)")
      .eq("user_id", user.id);

    if (params) {
      if (params.search && params.search.trim() !== "") {
        const searchTerm = `%${params.search.trim()}%`;
        query = query.or(`method.ilike.${searchTerm},notes.ilike.${searchTerm}`);
      }

      if (params.bean_id) {
        query = query.eq("bean_id", params.bean_id);
      }

      if (params.method) {
        query = query.eq("method", params.method);
      }

      if (params.min_rating) {
        query = query.gte("overall_rating", params.min_rating);
      }

      const sortBy = params.sort_by || "created_at";
      const isAscending = params.order === "asc";
      query = query.order(sortBy, { ascending: isAscending });

      if (params.page && params.limit) {
        const from = (params.page - 1) * params.limit;
        const to = from + params.limit - 1;
        query = query.range(from, to);
      }
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data: logsData, error } = await query;

    if (error) {
      console.error("getLogBrews DB Error:", error);
      return {
        success: false,
        error: LOG_BREWS_MESSAGE.ERROR.FETCH_FAILED,
      };
    }

    // Populate user tools untuk matching tool_ids
    const { data: toolsData } = await supabase
      .from("tools")
      .select("*")
      .or(`user_id.eq.${user.id},user_id.is.null`);

    const toolsMap = new Map<string, Tool>((toolsData || []).map((t) => [t.id, t]));

    const formattedLogs: LogBrew[] = (logsData || []).map((log) => {
      const tools = (log.tool_ids || [])
        .map((tid: string) => toolsMap.get(tid))
        .filter(Boolean) as Tool[];

      return {
        ...log,
        tools,
      };
    });

    return {
      success: true,
      message: LOG_BREWS_MESSAGE.SUCCESS.FETCH_SUCCESS,
      data: formattedLogs,
    };
  } catch (error) {
    console.error("getLogBrews Exception:", error);
    return {
      success: false,
      error: LOG_BREWS_MESSAGE.ERROR.SERVER_ERROR,
    };
  }
}

/**
 * 3. Ambil Detail Log Seduh Berdasarkan ID
 */
export async function getLogBrewById(
  id: string
): Promise<ActionResponse<LogBrew>> {
  try {
    if (!id || id.trim() === "") {
      return {
        success: false,
        error: LOG_BREWS_MESSAGE.ERROR.INVALID_ID,
      };
    }

    const supabase = await createServerSupabase();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      return {
        success: false,
        error: LOG_BREWS_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    const { data, error } = await supabase
      .from("log_brews")
      .select("*, bean:coffee_products(*, roasteries(*)), pouring_method:pouring_methods(*)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return {
        success: false,
        error: LOG_BREWS_MESSAGE.ERROR.NOT_FOUND,
      };
    }

    // Populate tools jika tool_ids ada
    let tools: Tool[] = [];
    if (data.tool_ids && data.tool_ids.length > 0) {
      const { data: toolsData } = await supabase
        .from("tools")
        .select("*")
        .in("id", data.tool_ids);
      tools = (toolsData || []) as Tool[];
    }

    return {
      success: true,
      data: {
        ...data,
        tools,
      } as LogBrew,
    };
  } catch (error) {
    console.error("getLogBrewById Exception:", error);
    return {
      success: false,
      error: LOG_BREWS_MESSAGE.ERROR.SERVER_ERROR,
    };
  }
}

/**
 * 4. Perbarui Catatan Seduh
 */
export async function updateLogBrew(
  payload: UpdateLogBrewPayload
): Promise<ActionResponse<LogBrew>> {
  try {
    const { id, ...updateData } = payload;
    if (!id || id.trim() === "") {
      return {
        success: false,
        error: LOG_BREWS_MESSAGE.ERROR.INVALID_ID,
      };
    }

    const validatedData = logBrewSchema.partial().safeParse(updateData);
    if (!validatedData.success) {
      return {
        success: false,
        error:
          validatedData.error.issues[0]?.message ||
          LOG_BREWS_MESSAGE.ERROR.UPDATE_FAILED,
      };
    }

    const supabase = await createServerSupabase();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      return {
        success: false,
        error: LOG_BREWS_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    // Sanitasi UUID pouring_method_id
    const updatedPayload = { ...validatedData.data };
    if (updatedPayload.pouring_method_id !== undefined) {
      updatedPayload.pouring_method_id =
        updatedPayload.pouring_method_id &&
        updatedPayload.pouring_method_id.trim() !== ""
          ? updatedPayload.pouring_method_id.trim()
          : null;
    }

    const { data, error } = await supabase
      .from("log_brews")
      .update(updatedPayload)
      .eq("id", id)
      .eq("user_id", user.id)
      .select("*, bean:coffee_products(*, roasteries(*)), pouring_method:pouring_methods(*)")
      .single();

    if (error || !data) {
      console.error("updateLogBrew DB Error:", error);
      return {
        success: false,
        error: error?.message || LOG_BREWS_MESSAGE.ERROR.UPDATE_FAILED,
      };
    }

    return {
      success: true,
      message: LOG_BREWS_MESSAGE.SUCCESS.UPDATE_SUCCESS,
      data: data as LogBrew,
    };
  } catch (error) {
    console.error("updateLogBrew Exception:", error);
    return {
      success: false,
      error: LOG_BREWS_MESSAGE.ERROR.SERVER_ERROR,
    };
  }
}

/**
 * 5. Hapus Catatan Seduh
 */
export async function deleteLogBrew(
  id: string
): Promise<ActionResponse<null>> {
  try {
    if (!id || id.trim() === "") {
      return {
        success: false,
        error: LOG_BREWS_MESSAGE.ERROR.INVALID_ID,
      };
    }

    const supabase = await createServerSupabase();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      return {
        success: false,
        error: LOG_BREWS_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    const { error } = await supabase
      .from("log_brews")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("deleteLogBrew DB Error:", error);
      return {
        success: false,
        error: error.message || LOG_BREWS_MESSAGE.ERROR.DELETE_FAILED,
      };
    }

    return {
      success: true,
      message: LOG_BREWS_MESSAGE.SUCCESS.DELETE_SUCCESS,
    };
  } catch (error) {
    console.error("deleteLogBrew Exception:", error);
    return {
      success: false,
      error: LOG_BREWS_MESSAGE.ERROR.SERVER_ERROR,
    };
  }
}

/**
 * Helper: Ambil daftar biji kopi untuk pilihan dropdown form
 */
export async function getCoffeeProductsForSelect(): Promise<ActionResponse<CoffeeProduct[]>> {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      return {
        success: false,
        error: LOG_BREWS_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    const { data, error } = await supabase
      .from("coffee_products")
      .select("*, roasteries(*)")
      .eq("user_id", user.id)
      .order("product_name", { ascending: true });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: (data || []) as CoffeeProduct[],
    };
  } catch (error) {
    return {
      success: false,
      error: LOG_BREWS_MESSAGE.ERROR.SERVER_ERROR,
    };
  }
}

/**
 * Helper: Ambil daftar alat (tools) milik user untuk pilihan dropdown form
 */
export async function getToolsForSelect(): Promise<ActionResponse<Tool[]>> {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      return {
        success: false,
        error: LOG_BREWS_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .or(`user_id.eq.${user.id},user_id.is.null`)
      .order("tool_name", { ascending: true });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: (data || []) as Tool[],
    };
  } catch (error) {
    return {
      success: false,
      error: LOG_BREWS_MESSAGE.ERROR.SERVER_ERROR,
    };
  }
}

/**
 * Helper: Ambil daftar metode penuangan (Preset System + Custom User Methods)
 */
export async function getPouringMethodsForSelect(): Promise<ActionResponse<PouringMethod[]>> {
  try {
    const res = await getPouringMethods();
    if (!res.success) {
      return {
        success: false,
        error: res.error || LOG_BREWS_MESSAGE.ERROR.FETCH_FAILED,
      };
    }
    return {
      success: true,
      data: res.data || [],
    };
  } catch (error) {
    return {
      success: false,
      error: LOG_BREWS_MESSAGE.ERROR.SERVER_ERROR,
    };
  }
}

/**
 * Helper: Ambil kalibrasi gilingan untuk Cheatsheet berdasarkan tool_id
 */
export async function getGrindSettingsForCheatsheet(toolId: string): Promise<ActionResponse<GrindSettings[]>> {
  try {
    if (!toolId) return { success: true, data: [] };

    const supabase = await createServerSupabase();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      return {
        success: false,
        error: LOG_BREWS_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    const { data: dataGrindSet, error } = await supabase
      .from("grind_settings")
      .select("*")
      .eq("tool_id", toolId)
      .eq("user_id", user.id);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

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
      data: formattedSettings,
    };
  } catch (error) {
    return {
      success: false,
      error: LOG_BREWS_MESSAGE.ERROR.SERVER_ERROR,
    };
  }
}
