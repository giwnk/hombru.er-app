"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, Coffee, Plus, Receipt, Workflow } from "lucide-react";
import Link from "next/link";

interface DashboardQuickActionsProps {
  onOpenLogBrewModal?: () => void;
  onOpenRecipeModal?: () => void;
}

export function DashboardQuickActions({
  onOpenLogBrewModal,
  onOpenRecipeModal,
}: DashboardQuickActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/70 shadow-2xs">
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1.5">
        <Plus className="w-4 h-4 text-primary" /> Aksi Cepat:
      </span>

      {onOpenLogBrewModal ? (
        <Button
          size="sm"
          onClick={onOpenLogBrewModal}
          className="h-8.5 text-xs rounded-xl font-semibold cursor-pointer gap-1.5 px-3.5 shadow-2xs"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Catat Seduhan Baru</span>
        </Button>
      ) : (
        <Link href="/brews">
          <Button
            size="sm"
            className="h-8.5 text-xs rounded-xl font-semibold cursor-pointer gap-1.5 px-3.5 shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Catat Seduhan Baru</span>
          </Button>
        </Link>
      )}

      {onOpenRecipeModal ? (
        <Button
          size="sm"
          variant="outline"
          onClick={onOpenRecipeModal}
          className="h-8.5 text-xs rounded-xl font-semibold cursor-pointer gap-1.5 px-3.5 border-primary/30 text-primary hover:bg-primary/10"
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Buat Resep Racikan</span>
        </Button>
      ) : (
        <Link href="/recipes">
          <Button
            size="sm"
            variant="outline"
            className="h-8.5 text-xs rounded-xl font-semibold cursor-pointer gap-1.5 px-3.5 border-primary/30 text-primary hover:bg-primary/10"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Buat Resep Racikan</span>
          </Button>
        </Link>
      )}

      <Link href="/collections">
        <Button
          size="sm"
          variant="secondary"
          className="h-8.5 text-xs rounded-xl font-semibold cursor-pointer gap-1.5 px-3.5"
        >
          <Coffee className="w-3.5 h-3.5 text-primary" />
          <span>Tambah Biji Kopi</span>
        </Button>
      </Link>

      <Link href="/pouring-methods">
        <Button
          size="sm"
          variant="ghost"
          className="h-8.5 text-xs rounded-xl font-medium cursor-pointer gap-1.5 px-3.5 text-muted-foreground hover:text-foreground"
        >
          <Workflow className="w-3.5 h-3.5 text-primary" />
          <span>Metode Penuangan</span>
        </Button>
      </Link>
    </div>
  );
}
