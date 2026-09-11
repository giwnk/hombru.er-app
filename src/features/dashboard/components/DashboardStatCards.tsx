"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Coffee,
  Receipt,
  Star,
  TrendingUp,
  Workflow,
} from "lucide-react";
import { DashboardStats } from "../types/dashboard.type";

interface DashboardStatCardsProps {
  stats: DashboardStats;
}

export function DashboardStatCards({ stats }: DashboardStatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* CARD 1: Total Seduhan */}
      <Card className="border border-border/70 hover:border-primary/40 transition-all duration-200 shadow-2xs bg-card overflow-hidden">
        <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Total Seduhan Kopi
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {stats.totalBrews}
              </h3>
              <span className="text-xs text-muted-foreground font-medium">cangkir</span>
            </div>
            {stats.brewsThisMonth > 0 && (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-medium"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                +{stats.brewsThisMonth} bulan ini
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* CARD 2: Koleksi Biji Kopi */}
      <Card className="border border-border/70 hover:border-primary/40 transition-all duration-200 shadow-2xs bg-card overflow-hidden">
        <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Koleksi Biji Kopi
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Coffee className="h-5 w-5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {stats.totalBeans}
              </h3>
              <span className="text-xs text-muted-foreground font-medium">varian</span>
            </div>
            {stats.favoriteBeanName ? (
              <p className="text-[11px] text-muted-foreground truncate font-medium">
                Favorit: <strong className="text-foreground">{stats.favoriteBeanName}</strong>
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">Katalog biji kopi kamu</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* CARD 3: Rata-Rata Rating */}
      <Card className="border border-border/70 hover:border-primary/40 transition-all duration-200 shadow-2xs bg-card overflow-hidden">
        <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Rata-Rata Rating
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Star className="h-5 w-5 fill-primary stroke-primary" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "-"}
              </h3>
              <span className="text-xs text-muted-foreground font-medium">/ 5.0</span>
            </div>
            {stats.avgProfileAccuracy > 0 && (
              <p className="text-[11px] text-muted-foreground font-medium">
                Akurasi Rasa: <strong className="text-primary font-bold">{stats.avgProfileAccuracy}/5</strong>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* CARD 4: Resep & Metode Utama */}
      <Card className="border border-border/70 hover:border-primary/40 transition-all duration-200 shadow-2xs bg-card overflow-hidden">
        <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Resep & Metode Utama
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Receipt className="h-5 w-5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {stats.totalRecipes}
              </h3>
              <span className="text-xs text-muted-foreground font-medium">resep racikan</span>
            </div>
            {stats.topMethod ? (
              <Badge
                variant="outline"
                className="bg-background border-primary/30 text-primary text-[10px] px-2 py-0.5 rounded-full font-medium"
              >
                <Workflow className="w-3 h-3 mr-1" />
                Utama: {stats.topMethod}
              </Badge>
            ) : (
              <p className="text-[11px] text-muted-foreground">Metode seduh terfavorit</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
