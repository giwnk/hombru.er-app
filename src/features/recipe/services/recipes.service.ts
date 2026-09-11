"use server";

import { createServerSupabase } from "@/lib/supabase/supabase";
import { ActionResponse } from "@/shared/response.type";
import { RECIPE_MESSAGE } from "../constants/recipes.constant";
import { recipeSchema } from "../types/recipes.schema";
import {
  CreateRecipePayload,
  Recipe,
  RecipeParams,
  UpdateRecipePayload,
} from "../types/recipes.type";
import { Tool } from "@/features/tools-and-grind-settings/types/tools.type";
import { LogBrew } from "@/features/log-brews/types/log-brews.types";

export interface PaginatedRecipeResponse {
  recipes: Recipe[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 1. Ambil Daftar Resep Seduh (dengan Pagination, Search & Filter)
 */
export async function getRecipes(
  params?: RecipeParams
): Promise<ActionResponse<PaginatedRecipeResponse>> {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      return {
        success: false,
        error: RECIPE_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    const page = params?.page && params.page > 0 ? params.page : 1;
    const limit = params?.limit && params.limit > 0 ? params.limit : 6;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("recipes")
      .select("*", { count: "exact" })
      .or(`user_id.eq.${user.id},user_id.is.null`);

    if (params?.search && params.search.trim() !== "") {
      const searchTerm = `%${params.search.trim()}%`;
      query = query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`);
    }

    if (params?.method && params.method.trim() !== "") {
      query = query.eq("method", params.method);
    }

    query = query.order("created_at", { ascending: false }).range(from, to);

    const { data: recipesData, count, error } = await query;

    if (error) {
      console.error("getRecipes DB Error:", error);
      return {
        success: false,
        error: RECIPE_MESSAGE.ERROR.FETCH_FAILED,
      };
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit) || 1;

    // Populate user tools untuk matching tool_ids jika ada
    const { data: toolsData } = await supabase
      .from("tools")
      .select("*")
      .or(`user_id.eq.${user.id},user_id.is.null`);

    const toolsMap = new Map<string, Tool>((toolsData || []).map((t) => [t.id, t]));

    const formattedRecipes: Recipe[] = (recipesData || []).map((rec) => {
      const tools = (rec.tool_ids || [])
        .map((tid: string) => toolsMap.get(tid))
        .filter(Boolean) as Tool[];

      return {
        ...rec,
        tools,
      };
    });

    return {
      success: true,
      message: RECIPE_MESSAGE.SUCCESS.FETCH_SUCCESS,
      data: {
        recipes: formattedRecipes,
        totalCount,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error) {
    console.error("getRecipes Exception:", error);
    return {
      success: false,
      error: RECIPE_MESSAGE.ERROR.SERVER_ERROR,
    };
  }
}

/**
 * 2. Ambil Detail Resep Seduh Berdasarkan ID
 */
export async function getRecipeById(
  id: string
): Promise<ActionResponse<Recipe>> {
  try {
    if (!id || id.trim() === "") {
      return {
        success: false,
        error: RECIPE_MESSAGE.ERROR.INVALID_ID,
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
        error: RECIPE_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return {
        success: false,
        error: RECIPE_MESSAGE.ERROR.NOT_FOUND,
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
      } as Recipe,
    };
  } catch (error) {
    console.error("getRecipeById Exception:", error);
    return {
      success: false,
      error: RECIPE_MESSAGE.ERROR.SERVER_ERROR,
    };
  }
}

/**
 * 3. Tambah Resep Seduh Baru
 */
export async function createRecipe(
  payload: CreateRecipePayload
): Promise<ActionResponse<Recipe>> {
  try {
    const validatedData = recipeSchema.safeParse(payload);
    if (!validatedData.success) {
      return {
        success: false,
        error:
          validatedData.error.issues[0]?.message ||
          RECIPE_MESSAGE.ERROR.CREATE_FAILED,
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
        error: RECIPE_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    const { data, error } = await supabase
      .from("recipes")
      .insert({
        ...validatedData.data,
        name: validatedData.data.name.trim(),
        description: validatedData.data.description?.trim() || null,
        instructions: validatedData.data.instructions?.trim() || null,
        user_id: user.id,
      })
      .select()
      .single();

    if (error || !data) {
      console.error("createRecipe DB Error:", error);
      return {
        success: false,
        error: error?.message || RECIPE_MESSAGE.ERROR.CREATE_FAILED,
      };
    }

    return {
      success: true,
      message: RECIPE_MESSAGE.SUCCESS.CREATE_SUCCESS,
      data: data as Recipe,
    };
  } catch (error) {
    console.error("createRecipe Exception:", error);
    return {
      success: false,
      error: RECIPE_MESSAGE.ERROR.SERVER_ERROR,
    };
  }
}

/**
 * 4. Perbarui Resep Seduh
 */
export async function updateRecipe(
  payload: UpdateRecipePayload
): Promise<ActionResponse<Recipe>> {
  try {
    const { id, ...updateFields } = payload;
    if (!id || id.trim() === "") {
      return {
        success: false,
        error: RECIPE_MESSAGE.ERROR.INVALID_ID,
      };
    }

    const validatedData = recipeSchema.partial().safeParse(updateFields);
    if (!validatedData.success) {
      return {
        success: false,
        error:
          validatedData.error.issues[0]?.message ||
          RECIPE_MESSAGE.ERROR.UPDATE_FAILED,
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
        error: RECIPE_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    const { data, error } = await supabase
      .from("recipes")
      .update({
        ...validatedData.data,
        name: validatedData.data.name?.trim(),
        description: validatedData.data.description?.trim() || null,
        instructions: validatedData.data.instructions?.trim() || null,
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error || !data) {
      console.error("updateRecipe DB Error:", error);
      return {
        success: false,
        error: error?.message || RECIPE_MESSAGE.ERROR.UPDATE_FAILED,
      };
    }

    return {
      success: true,
      message: RECIPE_MESSAGE.SUCCESS.UPDATE_SUCCESS,
      data: data as Recipe,
    };
  } catch (error) {
    console.error("updateRecipe Exception:", error);
    return {
      success: false,
      error: RECIPE_MESSAGE.ERROR.SERVER_ERROR,
    };
  }
}

/**
 * 5. Hapus Resep Seduh
 */
export async function deleteRecipe(
  id: string
): Promise<ActionResponse<null>> {
  try {
    if (!id || id.trim() === "") {
      return {
        success: false,
        error: RECIPE_MESSAGE.ERROR.INVALID_ID,
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
        error: RECIPE_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    const { error } = await supabase
      .from("recipes")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("deleteRecipe DB Error:", error);
      return {
        success: false,
        error: error.message || RECIPE_MESSAGE.ERROR.DELETE_FAILED,
      };
    }

    return {
      success: true,
      message: RECIPE_MESSAGE.SUCCESS.DELETE_SUCCESS,
    };
  } catch (error) {
    console.error("deleteRecipe Exception:", error);
    return {
      success: false,
      error: RECIPE_MESSAGE.ERROR.SERVER_ERROR,
    };
  }
}

/**
 * Helper: Ambil daftar jurnal seduh milik user untuk fitur Import ke Resep
 */
export async function getLogBrewsForImport(): Promise<ActionResponse<LogBrew[]>> {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      return {
        success: false,
        error: RECIPE_MESSAGE.ERROR.UNAUTHORIZED,
      };
    }

    const { data, error } = await supabase
      .from("log_brews")
      .select("*, bean:coffee_products(*, roasteries(*)), pouring_method:pouring_methods(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: (data || []) as LogBrew[],
    };
  } catch (error) {
    return {
      success: false,
      error: RECIPE_MESSAGE.ERROR.SERVER_ERROR,
    };
  }
}
