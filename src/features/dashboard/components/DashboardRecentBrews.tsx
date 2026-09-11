"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { LogBrew } from "@/features/log-brews/types/log-brews.types";
import { LogBrewCard } from "@/features/log-brews/components/LogBrewCard";
import { LogBrewDetailModal } from "@/features/log-brews/components/LogBrewDetailModal";

interface DashboardRecentBrewsProps {
  brews: LogBrew[];
  onEditBrew?: (brew: LogBrew) => void;
  onDeleteBrew?: (brew: LogBrew) => void;
}

export function DashboardRecentBrews({
  brews,
  onEditBrew,
  onDeleteBrew,
}: DashboardRecentBrewsProps) {
  const [selectedDetailBrew, setSelectedDetailBrew] = useState<LogBrew | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="space-y-0.5">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Seduhan Terbaru
          </h3>
          <p className="text-xs text-muted-foreground">
            Feed catatan seduhan kopi terakhir yang baru saja kamu buat.
          </p>
        </div>

        <Link href="/brews">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs font-semibold text-primary hover:text-primary hover:bg-primary/10 cursor-pointer rounded-xl gap-1"
          >
            <span>Lihat Semua Jurnal</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {brews.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-card/50 space-y-2">
          <p className="text-xs text-muted-foreground italic">
            Belum ada catatan seduh terdaftar. Yuk buat seduhan kopi pertama kamu!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {brews.map((brew) => (
            <LogBrewCard
              key={brew.id}
              log={brew}
              onViewDetail={(log) => setSelectedDetailBrew(log)}
              onEdit={(log) => onEditBrew?.(log)}
              onDelete={(log) => onDeleteBrew?.(log)}
            />
          ))}
        </div>
      )}

      {/* Modal Detail Seduhan */}
      <LogBrewDetailModal
        isOpen={Boolean(selectedDetailBrew)}
        log={selectedDetailBrew}
        onClose={() => setSelectedDetailBrew(null)}
        onEdit={(log) => {
          setSelectedDetailBrew(null);
          onEditBrew?.(log);
        }}
      />
    </div>
  );
}
