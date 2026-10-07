"use client";

import { Button } from "@/components/ui/button";
import { Plus, Receipt } from "lucide-react";
import RecipeList from "@/features/recipe/components/RecipeList";
import { useRecipeModal } from "@/features/recipe/hooks/useRecipeModal";

export default function RecipesPage() {
  const modal = useRecipeModal();

  return (
    <div className="w-full space-y-6">
      {/* 1. Header Section: Title & Top Right CTA Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary shrink-0" />
            <h1 className="font-sans text-xl sm:text-2xl font-bold text-foreground">
              Resep Seduh Kopi
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Kelola takaran racikan bahan, instruksi pembuatan, dan import resep dari catatan seduhan kopi favoritmu.
          </p>
        </div>

        {/* Header Action Button */}
        <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="default"
            onClick={modal.openCreateModal}
            className="w-full sm:w-auto justify-center gap-1.5 sm:gap-2 rounded-xl text-xs h-9 px-3 sm:px-4 font-semibold shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Tambah Resep</span>
          </Button>
        </div>
      </div>

      {/* 2. Main Feature Content Component */}
      <RecipeList externalModal={modal} />
    </div>
  );
}
