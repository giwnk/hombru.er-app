"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PouringMethod } from "../types/pouring-methods.types";
import {
  Clock,
  Droplets,
  Layers,
  Sparkles,
  Timer,
  Workflow,
  X,
} from "lucide-react";

interface PouringMethodDetailModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  method?: PouringMethod | null;
}

export default function PouringMethodDetailModal({
  isOpen = true,
  onClose,
  method,
}: PouringMethodDetailModalProps) {
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

  if (!isOpen || !method) return null;

  const totalWater =
    method.intervals && method.intervals.length > 0
      ? Math.max(...method.intervals.map((i) => i.target_water || 0))
      : 0;

  const totalDurationSec =
    method.intervals && method.intervals.length > 0
      ? method.intervals.reduce(
          (acc, item) => acc + (item.duration_seconds || 0),
          0
        )
      : 0;

  const formatDuration = (seconds?: number) => {
    if (!seconds || seconds <= 0) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs > 0 ? `${secs}s` : ""}`;
    }
    return `${secs} dtk`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all animate-in zoom-in-95 duration-200">
        {/* 1. Header Modal */}
        <div className="flex items-center justify-between border-b border-border/60 p-4 sm:p-5 bg-muted/20 shrink-0">
          <div className="flex items-center gap-3 pr-6 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Workflow className="h-5 w-5" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                {method.is_system_template ? (
                  <Badge
                    variant="secondary"
                    className="gap-1 text-[10px] font-medium bg-primary/10 text-primary border-primary/20 px-2 py-0 rounded-md"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-primary" />
                    <span>Preset Sistem</span>
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-medium border-border/70 text-muted-foreground px-2 py-0 rounded-md"
                  >
                    Custom Kamu
                  </Badge>
                )}
              </div>
              <h2 className="text-base font-bold text-foreground truncate">
                {method.pour_name}
              </h2>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-lg cursor-pointer text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 2. Body Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Description */}
          {method.description && (
            <div className="p-3.5 rounded-xl border border-border/70 bg-muted/10 text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">💡 Deskripsi & Teknik: </span>
              {method.description}
            </div>
          )}

          {/* Key Summary Badges */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-card border border-border/70 shadow-2xs text-center text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground font-medium">
                <Droplets className="w-3.5 h-3.5 text-primary" />
                <span>Total Air</span>
              </div>
              <p className="font-bold text-foreground text-sm">{totalWater}g</p>
            </div>

            <div className="space-y-0.5 border-x border-border/60 px-1">
              <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground font-medium">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>Jumlah Pour</span>
              </div>
              <p className="font-bold text-foreground text-sm">
                {method.intervals?.length || 0} Step
              </p>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground font-medium">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Total Waktu</span>
              </div>
              <p className="font-bold text-foreground text-sm">
                {formatDuration(totalDurationSec)}
              </p>
            </div>
          </div>

          {/* Timeline Table Steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Timeline Tahapan Penuangan Air
            </h4>

            <div className="space-y-2">
              {method.intervals?.map((interval, index) => {
                const prevTargetWater =
                  index > 0 ? method.intervals[index - 1].target_water || 0 : 0;
                const waterAdded = (interval.target_water || 0) - prevTargetWater;

                return (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-xl border border-border/70 bg-muted/10 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 font-bold text-xs text-primary shrink-0">
                        #{interval.step}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-foreground">
                          {interval.notes || `Penuangan Ke-${interval.step}`}
                        </p>
                        {interval.duration_seconds && (
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Timer className="w-3 h-3 text-muted-foreground" />
                            <span>Durasi: {formatDuration(interval.duration_seconds)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center text-xs">
                      <Badge variant="outline" className="text-[10px] font-medium border-border/60 text-muted-foreground">
                        +{waterAdded}g Air
                      </Badge>
                      <span className="font-bold text-foreground bg-background px-2.5 py-1 rounded-lg border border-border/60">
                        Target: {interval.target_water}g
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Footer Actions */}
        <div className="p-4 border-t border-border/60 bg-muted/20 flex justify-end shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 text-xs rounded-xl cursor-pointer"
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
