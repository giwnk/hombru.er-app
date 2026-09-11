"use client";

import { useGetDashboardStats } from "@/features/dashboard/hooks/useDashboard";
import { DashboardStatCards } from "@/features/dashboard/components/DashboardStatCards";
import { DashboardSensoryOverview } from "@/features/dashboard/components/DashboardSensoryOverview";
import { DashboardMethodBreakdown } from "@/features/dashboard/components/DashboardMethodBreakdown";
import { DashboardQuickActions } from "@/features/dashboard/components/DashboardQuickActions";
import { DashboardRecentBrews } from "@/features/dashboard/components/DashboardRecentBrews";
import { Button } from "@/components/ui/button";
import { AlertCircle, LayoutDashboard, Plus } from "lucide-react";
import { LogBrewFormModal } from "@/features/log-brews/components/LogBrewFormModal";
import RecipeFormModal from "@/features/recipe/components/RecipeFormModal";
import { DeleteLogBrewDialog } from "@/features/log-brews/components/DeleteLogBrewDialog";
import { useLogBrewModal } from "@/features/log-brews/hooks/useLogBrewModal";
import { useRecipeModal } from "@/features/recipe/hooks/useRecipeModal";

export default function DashboardPage() {
  const { data: stats, isLoading, isError, refetch } = useGetDashboardStats();

  const brewModal = useLogBrewModal();
  const recipeModal = useRecipeModal();

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary shrink-0" />
            <h1 className="font-sans text-xl sm:text-2xl font-bold text-foreground">
              Hombrü.er Dashboard
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Ringkasan aktivitas, statistik profil rasa, dan koleksi racikan seduhan kopi kamu.
          </p>
        </div>

        {/* Top CTA Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="default"
            onClick={brewModal.openCreateModal}
            className="w-full sm:w-auto justify-center gap-1.5 sm:gap-2 rounded-xl text-xs h-9 px-4 font-semibold shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Catat Seduhan</span>
          </Button>
        </div>
      </div>

      {/* 2. Loading & Error States */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-32 w-full rounded-2xl bg-muted/40 animate-pulse border border-border/40"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-72 w-full rounded-2xl bg-muted/40 animate-pulse border border-border/40" />
            <div className="h-72 w-full rounded-2xl bg-muted/40 animate-pulse border border-border/40" />
          </div>
        </div>
      ) : isError || !stats ? (
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-destructive/30 bg-destructive/5 space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-base font-bold text-foreground">
              Gagal Memuat Statistik Dashboard
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Terjadi kesalahan saat mengambil data statistik seduhan. Silakan coba lagi.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            className="h-8 text-xs rounded-xl font-semibold cursor-pointer px-4"
          >
            Coba Coba Lagi
          </Button>
        </div>
      ) : (
        /* 3. Dashboard Content */
        <div className="space-y-6 sm:space-y-8">
          {/* Quick Action Bar */}
          <DashboardQuickActions
            onOpenLogBrewModal={brewModal.openCreateModal}
            onOpenRecipeModal={recipeModal.openCreateModal}
          />

          {/* Hero KPI Stat Cards */}
          <DashboardStatCards stats={stats} />

          {/* 2-Column Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardSensoryOverview sensory={stats.sensoryAverages} />
            <DashboardMethodBreakdown
              methods={stats.methodDistribution}
              totalBrews={stats.totalBrews}
            />
          </div>

          {/* Recent Brew Logs Feed */}
          <DashboardRecentBrews
            brews={stats.recentBrews}
            onEditBrew={brewModal.openEditModal}
            onDeleteBrew={brewModal.openDeleteDialog}
          />
        </div>
      )}

      {/* Global Modals for Quick Actions from Dashboard */}
      <LogBrewFormModal
        isOpen={brewModal.isFormOpen}
        isEditMode={brewModal.isEditMode}
        initialData={brewModal.selectedBrew}
        onClose={brewModal.closeAllModals}
      />

      <DeleteLogBrewDialog
        isOpen={brewModal.isDeleteOpen}
        log={brewModal.selectedBrew}
        onClose={brewModal.closeAllModals}
      />

      <RecipeFormModal
        isOpen={recipeModal.isFormOpen}
        isEditMode={recipeModal.isEditMode}
        initialData={recipeModal.selectedRecipe}
        onClose={recipeModal.closeAllModals}
      />
    </div>
  );
}
