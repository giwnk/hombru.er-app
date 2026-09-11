"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calendar,
  FileText,
  Import,
  Receipt,
  Wrench,
  X,
} from "lucide-react";
import { Recipe } from "../types/recipes.type";

interface RecipeDetailModalProps {
  isOpen: boolean;
  recipe: Recipe | null;
  onClose: () => void;
  onEdit?: (recipe: Recipe) => void;
}

export function RecipeDetailModal({
  isOpen,
  recipe,
  onClose,
  onEdit,
}: RecipeDetailModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !recipe) return null;

  const formattedDate = recipe.created_at
    ? new Date(recipe.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  const ingredients = recipe.ingredients || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary font-bold text-xs rounded-full px-3 py-1"
            >
              {recipe.method || "Manual Brew"}
            </Badge>
            <h2 className="font-sans text-base font-bold text-foreground">
              Detail Resep Seduh
            </h2>
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground cursor-pointer"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Body Modal Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Header Info Resep */}
          <div className="space-y-1.5 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase flex items-center gap-1">
              <Receipt className="w-3.5 h-3.5" /> Nama Resep Seduh
            </span>
            <h3 className="text-lg font-extrabold text-foreground">{recipe.name}</h3>
            {recipe.description && (
              <p className="text-xs font-medium text-muted-foreground leading-relaxed pt-0.5">
                {recipe.description}
              </p>
            )}
          </div>

          {/* Table / List Takaran Bahan (Ingredients) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-border/40 pb-1">
              <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-primary" /> Takaran & Komposisi Bahan
              </h4>
              <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary font-bold">
                {ingredients.length} Bahan
              </Badge>
            </div>

            {ingredients.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2 italic">Belum ada bahan terdaftar.</p>
            ) : (
              <div className="space-y-2 pt-1">
                {ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 font-bold text-[10px] text-primary shrink-0">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-foreground truncate">{ing.name}</span>
                      {ing.isImported && (
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-primary/30 text-primary">
                          Imported
                        </Badge>
                      )}
                    </div>
                    <div className="font-extrabold text-primary text-sm shrink-0">
                      {ing.amount} <span className="text-xs font-semibold text-muted-foreground">{ing.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instruksi Pembuatan */}
          {recipe.instructions && (
            <div className="space-y-1.5">
              <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest border-b border-border/40 pb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary" /> Instruksi & Tahapan Pembuatan
              </h4>
              <div className="p-4 bg-muted/30 rounded-2xl border border-border/40 text-foreground leading-relaxed whitespace-pre-wrap text-xs font-medium">
                {recipe.instructions}
              </div>
            </div>
          )}

          {/* Tools List */}
          {recipe.tools && recipe.tools.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest border-b border-border/40 pb-1 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-primary" /> Alat Seduh yang Digunakan
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {recipe.tools.map((t) => (
                  <Badge
                    key={t.id}
                    variant="secondary"
                    className="bg-muted text-foreground text-xs py-1 px-2.5 rounded-lg border border-border/60 font-medium"
                  >
                    {t.tool_name} {t.brand ? `(${t.brand})` : ""}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Created Date */}
          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] pt-2 border-t border-border/40">
            <Calendar className="w-3.5 h-3.5" />
            <span>Dibuat pada {formattedDate}</span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-border/60 bg-muted/20">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs rounded-lg px-4 cursor-pointer"
            onClick={onClose}
          >
            Tutup
          </Button>
          {onEdit && (
            <Button
              type="button"
              size="sm"
              className="h-8 text-xs rounded-lg px-4 font-semibold cursor-pointer"
              onClick={() => {
                onClose();
                onEdit(recipe);
              }}
            >
              Edit Resep
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
