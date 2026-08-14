"use server";

import { createServerSupabase } from "@/lib/supabase/supabase";
import { CP_MESSAGES } from "../constants/coffee-products.constant";
import { coffeeProductsSchema } from "../types/coffee-products.schema";
import { ActionResponse } from "@/shared/response.type";
import {
  CoffeeProduct,
  CoffeeProductParams,
  CreateProductPayload,
  UpdateProductPayload,
} from "../types/coffee-products.type";

export async function createCoffeeProduct(
  payload: CreateProductPayload
): Promise<ActionResponse<CoffeeProduct>> {
  try {
    // 1. Validasi input menggunakan Zod schema
    const validatedData = coffeeProductsSchema.safeParse(payload);
    if (!validatedData.success) {
      const firstErrorMessage =
        validatedData.error.issues[0]?.message ||
        "Data yang dimasukkan tidak valid.";
      return {
        success: false,
        error: firstErrorMessage,
      };
    }

    // 2. Inisialisasi Supabase Server Client
    const supabase = await createServerSupabase();

    // 3. Ambil data user yang sedang login
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

    // 3.5 Pastikan roastery_id terdaftar di tabel roasteries agar tidak melanggar Foreign Key Constraint
    let finalRoasteryId = validatedData.data.roastery_id;

    if (finalRoasteryId) {
      const { data: existingRoastery } = await supabase
        .from("roasteries")
        .select("id")
        .eq("id", finalRoasteryId)
        .maybeSingle();

      if (!existingRoastery) {
        const { data: newRoastery, error: roasteryError } = await supabase
          .from("roasteries")
          .insert({
            id: finalRoasteryId,
            name: "Default Roastery",
            user_id: user.id,
          })
          .select("id")
          .single();

        if (roasteryError) {
          const { data: autoRoastery } = await supabase
            .from("roasteries")
            .insert({
              name: "Default Roastery",
              user_id: user.id,
            })
            .select("id")
            .single();

          if (autoRoastery) {
            finalRoasteryId = autoRoastery.id;
          }
        }
      }
    }

    // 4. Transformasi empty string ("") ke null agar kompatibel dengan tipe DATE/NUMERIC di PostgreSQL
    const sanitizedData = Object.fromEntries(
      Object.entries(validatedData.data).map(([key, val]) => [
        key,
        val === "" ? null : val,
      ])
    );

    // 5. Insert data ke tabel coffee_products
    const { data: newProduct, error: insertError } = await supabase
      .from("coffee_products")
      .insert({
        ...sanitizedData,
        roastery_id: finalRoasteryId,
        user_id: user.id,
      })
      .select("*, roasteries(*)")
      .single();

    if (insertError) {
      console.error("Insert Coffee Product DB Error:", insertError);
      return {
        success: false,
        error: insertError.message || CP_MESSAGES.ERROR.SERVER_ERROR,
      };
    }

    // 5. Kembalikan respons sukses
    return {
      success: true,
      message: CP_MESSAGES.SUCCESS.CREATE,
      data: newProduct as CoffeeProduct,
    };
  } catch (err) {
    console.error("createCoffeeProduct Error:", err);
    return {
      success: false,
      error: CP_MESSAGES.ERROR.SERVER_ERROR,
    };
  }
}

export async function getCoffeeProducts(
  params?: CoffeeProductParams
): Promise<ActionResponse<CoffeeProduct[]>> {
  try {
    const supabase = await createServerSupabase();

    // 1. Ambil data user yang sedang login
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

    // 2. Mulai query builder dasar (hanya ambil produk milik user ini)
    let query = supabase
      .from("coffee_products")
      .select("*, roasteries(*)")
      .eq("user_id", user.id);

    // 3. Terapkan Filter Dinamis jika params diberikan
    if (params) {
      // Filter Pencarian Teks (Product Name)
      if (params.search && params.search.trim() !== "") {
        query = query.ilike("product_name", `%${params.search.trim()}%`);
      }

      // Filter Roastery ID
      if (params.roastery_id) {
        query = query.eq("roastery_id", params.roastery_id);
      }

      // Filter Processing Method
      if (params.processing) {
        query = query.eq("processing", params.processing);
      }

      // Filter Roast Level
      if (params.roast_level) {
        query = query.eq("roast_level", params.roast_level);
      }

      // Sorting (Pengurutan Data)
      const sortBy = params.sort_by || "created_at";
      const isAscending = params.order === "asc";
      query = query.order(sortBy, { ascending: isAscending });

      // Pagination (Pembagian Halaman)
      if (params.page && params.limit) {
        const from = (params.page - 1) * params.limit;
        const to = from + params.limit - 1;
        query = query.range(from, to);
      }
    } else {
      // Default Sort jika tanpa params: urutkan dari yang terbaru
      query = query.order("created_at", { ascending: false });
    }

    // 4. Eksekusi query
    const { data: products, error: queryError } = await query;

    if (queryError) {
      console.error("getCoffeeProducts DB Error:", queryError);
      return {
        success: false,
        error: CP_MESSAGES.ERROR.SERVER_ERROR,
      };
    }

    // Standardisasi relasi roastery/roasteries agar konsisten
    const formattedProducts = (products || []).map((item: CoffeeProduct) => {
      const roasteryObj = item.roastery || item.roasteries;
      return {
        ...item,
        roastery: roasteryObj,
        roasteries: roasteryObj,
      };
    });

    // 5. Kembalikan respons sukses
    return {
      success: true,
      data: formattedProducts as CoffeeProduct[],
    };
  } catch (error) {
    console.error("getCoffeeProducts Error:", error);
    return {
      success: false,
      error: CP_MESSAGES.ERROR.SERVER_ERROR,
    };
  }
}

export async function getCoffeeProductsById(
  id: string
): Promise<ActionResponse<CoffeeProduct>> {
  try {
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

    if (!id || id.trim() === "") {
      return {
        success: false,
        error: "ID produk tidak valid.",
      };
    }

    const { data: dataProduct, error: dataError } = await supabase
      .from("coffee_products")
      .select("*, roasteries(*)")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (dataError || !dataProduct) {
      return {
        success: false,
        error: CP_MESSAGES.ERROR.NOT_FOUND,
      };
    }

    return {
      success: true,
      data: dataProduct as CoffeeProduct,
    };
  } catch (error) {
    console.error("getCoffeeProductsById Error:", error);
    return {
      success: false,
      error: CP_MESSAGES.ERROR.SERVER_ERROR,
    };
  }
}

export async function updateCoffeeProduct(
  payload: UpdateProductPayload
): Promise<ActionResponse<CoffeeProduct>> {
  try {
    const { id, ...updateData } = payload;

    if (!id || id.trim() === "") {
      return {
        success: false,
        error: "ID produk tidak valid.",
      };
    }

    const validatedData = coffeeProductsSchema.partial().safeParse(updateData);
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
        error: "Sesi telah berakhir. Silakan login kembali.",
      };
    }

    const sanitizedUpdateData = Object.fromEntries(
      Object.entries(validatedData.data).map(([key, val]) => [
        key,
        val === "" ? null : val,
      ])
    );

    const { data: updatedProduct, error: updateError } = await supabase
      .from("coffee_products")
      .update(sanitizedUpdateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select("*, roasteries(*)")
      .single();

    if (updateError) {
      console.error("updateCoffeeProduct DB Error:", updateError);
      return {
        success: false,
        error: updateError.message || CP_MESSAGES.ERROR.SERVER_ERROR,
      };
    }

    return {
      success: true,
      message: CP_MESSAGES.SUCCESS.UPDATE,
      data: updatedProduct as CoffeeProduct,
    };
  } catch (error) {
    console.error("updateCoffeeProduct Error:", error);
    return {
      success: false,
      error: CP_MESSAGES.ERROR.SERVER_ERROR,
    };
  }
}

export async function deleteCoffeeProduct(
  id: string
): Promise<ActionResponse<null>> {
  try {
    if (!id || id.trim() === "") {
      return {
        success: false,
        error: "ID produk tidak valid.",
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

    const { error: deleteError } = await supabase
      .from("coffee_products")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("deleteCoffeeProduct DB Error:", deleteError);
      return {
        success: false,
        error: deleteError.message || CP_MESSAGES.ERROR.SERVER_ERROR,
      };
    }

    return {
      success: true,
      message: CP_MESSAGES.SUCCESS.DELETE,
    };
  } catch (error) {
    console.error("deleteCoffeeProduct Error:", error);
    return {
      success: false,
      error: CP_MESSAGES.ERROR.SERVER_ERROR,
    };
  }
}

export async function getRoasteries() {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("roasteries")
      .select("*")
      .order("roastery_name", { ascending: true });

    if (error) {
      console.error("getRoasteries Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, error: "Gagal mengambil data roastery." };
  }
}

