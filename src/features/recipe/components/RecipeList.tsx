"use client";

import { useState } from "react";
import SearchAndFilterToolbar from "@/shared/components/SearchAndFilterToolbar";
import { RecipeCard } from "./RecipeCard";
import { RecipeDetailModal } from "./RecipeDetailModal";
import DeleteRecipeDialog from "./DeleteRecipeDialog";
import RecipeFormModal from "./RecipeFormModal";
import { useGetRecipes } from "../hooks/useRecipes";
import { useRecipeModal } from "../hooks/useRecipeModal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Receipt,
} from "lucide-react";
import { RECIPE_METHODS } from "../constants/recipes.constant";

interface RecipeListProps {
  externalModal?: ReturnType<typeof useRecipeModal>;
}

export default function RecipeList({ externalModal }: RecipeListProps) {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetRecipes({
    search,
    method: methodFilter,
    page,
    limit,
  });

  const recipes = data?.recipes || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  const localModal = useRecipeModal();
  const modal = externalModal || localModal;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Search & Filter Toolbar */}
      <SearchAndFilterToolbar
        searchPlaceholder="Cari nama resep atau deskripsi..."
        searchQuery={search}
        onSearchChange={(val: string) => {
          setSearch(val);
          setPage(1);
        }}
        filters={
          <Select
            value={methodFilter || "ALL"}
            onValueChange={(val) => {
              setMethodFilter(val === "ALL" ? "" : val);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9.5 text-xs w-[160px] rounded-xl bg-background border-border/70">
              <SelectValue placeholder="Semua Metode" />
            </SelectTrigger>
            <SelectContent className="z-[70]">
              <SelectItem value="ALL">Semua Metode</SelectItem>
              {RECIPE_METHODS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {/* 2. Grid Container List */}
      {isLoading ? (
        // Skeleton Loading State
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-72 w-full rounded-2xl bg-muted/40 animate-pulse border border-border/40"
            />
          ))}
        </div>
      ) : isError ? (
        // Error State
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-destructive/30 bg-destructive/5 space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-base font-bold text-foreground">
              Gagal Memuat Resep Seduh
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Terjadi kesalahan saat mengambil data resep. Silakan coba lagi.
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
      ) : recipes.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onViewDetail={modal.openDetailModal}
                onEdit={modal.openEditModal}
                onDelete={modal.openDeleteDialog}
              />
            ))}
          </div>

          {/* 3. Baris Navigasi Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/50 text-xs">
              <span className="text-muted-foreground font-medium">
                Menampilkan {(page - 1) * limit + 1} - {Math.min(page * limit, totalCount)} dari {totalCount} resep (Halaman {page} dari {totalPages})
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="h-8 text-xs rounded-xl cursor-pointer gap-1 px-3"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </Button>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-8 w-8 p-0 text-xs rounded-xl font-semibold cursor-pointer ${
                        pageNum === page
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className="h-8 text-xs rounded-xl cursor-pointer gap-1 px-3"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-border bg-card/50 space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Receipt className="h-7 w-7" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h3 className="text-base font-bold text-foreground">
              {search || methodFilter ? "Resep Tidak Ditemukan" : "Belum Ada Resep Seduh"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {search || methodFilter
                ? `Tidak ada resep seduh yang cocok dengan filter kata kunci pencarian.`
                : "Buat resep seduh racikan kamu sendiri dengan input bahan manual atau import dari catatan seduhan."}
            </p>
          </div>

          {!search && !methodFilter && (
            <Button
              size="sm"
              onClick={modal.openCreateModal}
              className="h-9 text-xs rounded-xl font-semibold cursor-pointer gap-1.5 px-4"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Resep Pertama</span>
            </Button>
          )}
        </div>
      )}

      {/* 4. Modals & Dialog Overlays */}
      <RecipeFormModal
        isOpen={modal.isFormOpen}
        isEditMode={modal.isEditMode}
        initialData={modal.selectedRecipe}
        onClose={modal.closeAllModals}
      />

      <RecipeDetailModal
        isOpen={modal.isDetailOpen}
        recipe={modal.selectedRecipe}
        onClose={modal.closeAllModals}
        onEdit={modal.openEditModal}
      />

      <DeleteRecipeDialog
        isOpen={modal.isDeleteOpen}
        recipe={modal.selectedRecipe}
        onClose={modal.closeAllModals}
      />
    </div>
  );
}
