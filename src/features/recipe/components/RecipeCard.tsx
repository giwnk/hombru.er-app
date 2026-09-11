"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  MoreVertical,
  Pencil,
  Receipt,
  Trash2,
  Wrench,
  FileText,
  Workflow,
} from "lucide-react";
import { Recipe } from "../types/recipes.type";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface RecipeCardProps {
  recipe: Recipe;
  onViewDetail: (recipe: Recipe) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
}

export function RecipeCard({
  recipe,
  onViewDetail,
  onEdit,
  onDelete,
}: RecipeCardProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const formattedDate = recipe.created_at
    ? new Date(recipe.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  const ingredients = recipe.ingredients || [];

  return (
    <Card className="group relative border border-border/70 hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden bg-card flex flex-col justify-between h-full">
      <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
        {/* 1. Header Card: Method Badge & Action Popover */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary hover:bg-primary/20 font-semibold px-2.5 py-0.5 text-xs rounded-full"
            >
              {recipe.method || "Manual Brew"}
            </Badge>

            {recipe.log_brews_id && (
              <Badge
                variant="outline"
                className="bg-background border-primary/30 text-primary text-[10px] px-2 py-0.5 rounded-full"
              >
                Imported Log
              </Badge>
            )}
          </div>

          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer shrink-0"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-36 p-1 bg-card border-border z-40" align="end">
              <div className="flex flex-col gap-0.5 text-xs">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8 px-2 text-foreground font-normal hover:bg-muted cursor-pointer"
                  onClick={() => {
                    setIsPopoverOpen(false);
                    onViewDetail(recipe);
                  }}
                >
                  <Eye className="w-3.5 h-3.5 mr-2 text-primary" />
                  Lihat Detail
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8 px-2 text-foreground font-normal hover:bg-muted cursor-pointer"
                  onClick={() => {
                    setIsPopoverOpen(false);
                    onEdit(recipe);
                  }}
                >
                  <Pencil className="w-3.5 h-3.5 mr-2 text-primary" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8 px-2 text-destructive font-normal hover:bg-destructive/10 cursor-pointer"
                  onClick={() => {
                    setIsPopoverOpen(false);
                    onDelete(recipe);
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Hapus
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* 2. Nama & Deskripsi Resep */}
        <div className="space-y-1">
          <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {recipe.name}
          </h3>
          {recipe.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {recipe.description}
            </p>
          )}
        </div>

        {/* 3. List Takaran Bahan (Ingredients Badges) */}
        <div className="space-y-2 p-3 bg-muted/40 rounded-xl text-xs border border-border/40">
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground border-b border-border/40 pb-1">
            <span className="flex items-center gap-1">
              <Receipt className="w-3 h-3 text-primary" /> Takaran Bahan
            </span>
            <span>{ingredients.length} Bahan</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {ingredients.slice(0, 4).map((ing, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="bg-card text-foreground text-[11px] py-0.5 px-2 rounded-lg border border-border/50 font-medium"
              >
                {ing.name}: <strong className="text-primary ml-1">{ing.amount}{ing.unit}</strong>
              </Badge>
            ))}
            {ingredients.length > 4 && (
              <Badge variant="outline" className="text-[10px] text-muted-foreground py-0.5 px-1.5">
                +{ingredients.length - 4} lainnya
              </Badge>
            )}
          </div>
        </div>

        {/* 4. Display Tools if present */}
        {recipe.tools && recipe.tools.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 text-[11px]">
            <Wrench className="w-3 h-3 text-primary shrink-0 mr-0.5" />
            {recipe.tools.map((t) => (
              <Badge
                key={t.id}
                variant="outline"
                className="text-[10px] py-0 px-1.5 font-normal bg-muted/30 text-muted-foreground border-border/60"
              >
                {t.tool_name}
              </Badge>
            ))}
          </div>
        )}

        {/* 5. Footer: Tanggal & Button Detail */}
        <div className="flex items-center justify-between border-t border-border/40 pt-3 text-xs">
          <span className="text-[11px] text-muted-foreground font-medium">
            {formattedDate}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs px-3 font-semibold text-primary hover:text-primary hover:bg-primary/10 cursor-pointer rounded-lg"
            onClick={() => onViewDetail(recipe)}
          >
            Lihat Detail
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
