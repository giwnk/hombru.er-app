"use client";

import React, { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";

export interface SearchAndFilterToolbarProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  showFilterLabel?: boolean;
  actions?: ReactNode;
}

export default function SearchAndFilterToolbar({
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Cari data...",
  filters,
  showFilterLabel = true,
  actions,
}: SearchAndFilterToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card border border-border/80 p-3.5 sm:p-4 rounded-2xl shadow-2xs">
      {/* 1. Search Bar Input */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9.5 h-9.5 text-xs rounded-xl border-border/70 bg-background focus-visible:ring-primary/40"
        />
      </div>

      {/* 2. Filters & Actions Section */}
      {(filters || actions) && (
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Filters Slot dengan Integrated Filter Label */}
          {filters && (
            <div className="flex items-center gap-2 flex-1 sm:flex-initial min-w-0">
              {showFilterLabel && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground shrink-0 pr-2 border-r border-border/60">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Filter:</span>
                </div>
              )}
              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                {filters}
              </div>
            </div>
          )}

          {/* Action Buttons Slot */}
          {actions && (
            <div className="flex items-center gap-2 shrink-0">{actions}</div>
          )}
        </div>
      )}
    </div>
  );
}
