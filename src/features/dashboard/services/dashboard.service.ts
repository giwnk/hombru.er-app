"use server";

import { createServerSupabase } from "@/lib/supabase/supabase";
import { ActionResponse } from "@/shared/response.type";
import { DashboardStats, MethodDistributionItem, SensoryAverages } from "../types/dashboard.type";
import { LogBrew } from "@/features/log-brews/types/log-brews.types";
import { Tool } from "@/features/tools-and-grind-settings/types/tools.type";
import { CoffeeProduct } from "@/features/coffee-products-and-roasteries/types/coffee-products.type";

/**
 * Server Action: Mengambil seluruh statistik & data agregasi untuk Dashboard
 */
export async function getDashboardStats(): Promise<ActionResponse<DashboardStats>> {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      return {
        success: false,
        error: "Kamu harus login terlebih dahulu.",
      };
    }

    // 1. Fetch Log Brews milik user
    const { data: logsData } = await supabase
      .from("log_brews")
      .select("*, bean:coffee_products(*, roasteries(*)), pouring_method:pouring_methods(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const logs = logsData || [];
    const totalBrews = logs.length;

    // Hitung seduhan bulan ini
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const brewsThisMonth = logs.filter((l) => {
      if (!l.created_at) return false;
      const d = new Date(l.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    // Hitung Average Rating & Akurasi Profil Rasa
    const ratedLogs = logs.filter((l) => typeof l.overall_rating === "number" && l.overall_rating > 0);
    const avgRating =
      ratedLogs.length > 0
        ? Number(
            (
              ratedLogs.reduce((acc, curr) => acc + (curr.overall_rating || 0), 0) /
              ratedLogs.length
            ).toFixed(1)
          )
        : 0;

    // Hitung Rata-Rata Profil Rasa (Sensory Profile)
    let sweetSum = 0,
      acidSum = 0,
      bodySum = 0,
      claritySum = 0,
      bitterSum = 0,
      finishSum = 0,
      accSum = 0,
      sensoryCount = 0;

    logs.forEach((l) => {
      if (l.sensory_profile) {
        sensoryCount++;
        sweetSum += l.sensory_profile.sweetness ?? 0;
        acidSum += l.sensory_profile.acidity ?? 0;
        bodySum += l.sensory_profile.body ?? 0;
        claritySum += l.sensory_profile.clarity ?? 0;
        bitterSum += l.sensory_profile.bitterness ?? 0;
        finishSum += l.sensory_profile.aftertaste ?? 0;
        accSum += l.sensory_profile.profile_accuracy ?? 0;
      }
    });

    const sensoryAverages: SensoryAverages = {
      sweetness: sensoryCount > 0 ? Number((sweetSum / sensoryCount).toFixed(1)) : 0,
      acidity: sensoryCount > 0 ? Number((acidSum / sensoryCount).toFixed(1)) : 0,
      body: sensoryCount > 0 ? Number((bodySum / sensoryCount).toFixed(1)) : 0,
      clarity: sensoryCount > 0 ? Number((claritySum / sensoryCount).toFixed(1)) : 0,
      bitterness: sensoryCount > 0 ? Number((bitterSum / sensoryCount).toFixed(1)) : 0,
      aftertaste: sensoryCount > 0 ? Number((finishSum / sensoryCount).toFixed(1)) : 0,
      profile_accuracy: sensoryCount > 0 ? Number((accSum / sensoryCount).toFixed(1)) : 0,
    };

    const avgProfileAccuracy = sensoryAverages.profile_accuracy;

    // Hitung Distribusi Metode Seduh
    const methodCounts = new Map<string, number>();
    logs.forEach((l) => {
      const m = l.method || "Lainnya";
      methodCounts.set(m, (methodCounts.get(m) || 0) + 1);
    });

    const methodDistribution: MethodDistributionItem[] = Array.from(
      methodCounts.entries()
    )
      .map(([method, count]) => ({
        method,
        count,
        percentage: totalBrews > 0 ? Math.round((count / totalBrews) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const topMethod = methodDistribution.length > 0 ? methodDistribution[0].method : null;

    // Hitung Biji Kopi Paling Sering Diseduh
    const beanCounts = new Map<string, { count: number; name: string }>();
    logs.forEach((l) => {
      if (l.bean_id && l.bean?.product_name) {
        const existing = beanCounts.get(l.bean_id);
        if (existing) {
          existing.count++;
        } else {
          beanCounts.set(l.bean_id, { count: 1, name: l.bean.product_name });
        }
      }
    });

    const sortedBeans = Array.from(beanCounts.values()).sort((a, b) => b.count - a.count);
    const favoriteBeanName = sortedBeans.length > 0 ? sortedBeans[0].name : null;

    // Populate tools untuk 5 recent brews
    const { data: toolsData } = await supabase
      .from("tools")
      .select("*")
      .or(`user_id.eq.${user.id},user_id.is.null`);

    const toolsMap = new Map<string, Tool>((toolsData || []).map((t) => [t.id, t]));

    const recentBrews: LogBrew[] = logs.slice(0, 5).map((log) => {
      const tools = (log.tool_ids || [])
        .map((tid: string) => toolsMap.get(tid))
        .filter(Boolean) as Tool[];

      return {
        ...log,
        tools,
      };
    });

    // 2. Fetch Coffee Products (Total & Active Spotlight)
    const { data: beansData, count: beanCount } = await supabase
      .from("coffee_products")
      .select("*, roasteries(*)", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const totalBeans = beanCount || 0;
    const activeBean = (beansData && beansData.length > 0 ? beansData[0] : null) as CoffeeProduct | null;

    // 3. Fetch Total Recipes
    const { count: recipeCount } = await supabase
      .from("recipes")
      .select("*", { count: "exact" })
      .or(`user_id.eq.${user.id},user_id.is.null`);

    const totalRecipes = recipeCount || 0;

    return {
      success: true,
      message: "Statistik dashboard berhasil dimuat.",
      data: {
        totalBrews,
        brewsThisMonth,
        totalBeans,
        favoriteBeanName,
        avgRating,
        avgProfileAccuracy,
        totalRecipes,
        topMethod,
        methodDistribution,
        sensoryAverages,
        recentBrews,
        activeBean,
      },
    };
  } catch (error) {
    console.error("getDashboardStats Exception:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat memuat statistik dashboard.",
    };
  }
}
