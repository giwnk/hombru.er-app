"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PouringMethod } from "../types/pouring-methods.types";
import {
  Clock,
  Droplets,
  Eye,
  Layers,
  Pencil,
  Trash2,
} from "lucide-react";

interface PouringMethodCardProps {
  method: PouringMethod;
  onDetail?: (method: PouringMethod) => void;
  onEdit?: (method: PouringMethod) => void;
  onDelete?: (method: PouringMethod) => void;
}

export default function PouringMethodCard({
  method,
  onDetail,
  onEdit,
  onDelete,
}: PouringMethodCardProps) {
  // Hitung total air dari step penuangan paling akhir
  const totalWater =
    method.intervals && method.intervals.length > 0
      ? Math.max(...method.intervals.map((i) => i.target_water || 0))
      : 0;

  // Hitung perkiraan total durasi seduh dalam detik & format menit:detik
  const totalDurationSec =
    method.intervals && method.intervals.length > 0
      ? method.intervals.reduce(
          (acc, item) => acc + (item.duration_seconds || 0),
          0
        )
      : 0;

  const formatDuration = (seconds: number) => {
    if (seconds <= 0) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs > 0 ? `${secs}s` : ""}`;
    }
    return `${secs} dtk`;
  };

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-md">
      <div>
        {/* 1. Card Header: Badge & Action Icon Buttons */}
        <CardHeader className="p-0 pb-3 flex-row items-start justify-between gap-2 border-b border-border/50">
          <div className="space-y-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {method.is_system_template && (
                <Badge
                  variant="secondary"
                  className="gap-1 text-[10px] font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 px-2 py-0.5 rounded-lg shrink-0"
                >
                  <span>Default Preset</span>
                </Badge>
              )}
            </div>

            <h3 className="font-sans text-base font-bold text-foreground leading-snug truncate pt-0.5">
              {method.pour_name}
            </h3>
          </div>

          {/* Icon Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {!method.is_system_template && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  title="Edit Metode"
                  className="h-7.5 w-7.5 cursor-pointer rounded-lg border border-border/60 hover:bg-accent text-foreground shadow-2xs"
                  onClick={() => onEdit?.(method)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  title="Hapus Metode"
                  className="h-7.5 w-7.5 cursor-pointer rounded-lg border border-border/60 hover:bg-destructive hover:text-destructive-foreground text-destructive shadow-2xs"
                  onClick={() => onDelete?.(method)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        </CardHeader>

        {/* 2. Card Content: Metrik Ringkas & Deskripsi */}
        <CardContent className="p-0 pt-3 space-y-3">
          {/* Key Metrics Chips */}
          <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-muted/20 border border-border/50 text-center text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground font-medium">
                <Droplets className="w-3 h-3 text-primary" />
                <span>Total Air</span>
              </div>
              <p className="font-bold text-foreground truncate">{totalWater}g</p>
            </div>

            <div className="space-y-0.5 border-x border-border/50 px-1">
              <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground font-medium">
                <Layers className="w-3 h-3 text-primary" />
                <span>Tahapan</span>
              </div>
              <p className="font-bold text-foreground truncate">
                {method.intervals?.length || 0} Pour
              </p>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground font-medium">
                <Clock className="w-3 h-3 text-primary" />
                <span>Est. Waktu</span>
              </div>
              <p className="font-bold text-foreground truncate">
                {formatDuration(totalDurationSec)}
              </p>
            </div>
          </div>

          {/* Description */}
          {method.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {method.description}
            </p>
          )}

          {/* Quick Steps Preview List */}
          <div className="space-y-1 pt-1">
            <p className="text-[11px] font-semibold text-muted-foreground">
              Tahapan Penuangan Air:
            </p>
            <div className="space-y-1">
              {method.intervals?.slice(0, 3).map((interval, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-muted/10 border border-border/40"
                >
                  <span className="font-medium text-foreground truncate">
                    Step {interval.step}: {interval.notes || `Penuangan ${interval.step}`}
                  </span>
                  <span className="font-bold text-primary shrink-0 ml-2">
                    {interval.target_water}g
                  </span>
                </div>
              ))}

              {method.intervals && method.intervals.length > 3 && (
                <p className="text-[10px] text-muted-foreground text-center pt-0.5 font-medium">
                  +{method.intervals.length - 3} tahapan penuangan lainnya...
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </div>

      {/* 3. Card Footer */}
      <CardFooter className="w-full p-2 mt-3 border-t border-border/50 flex items-center justify-between gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDetail?.(method)}
          className="w-full h-8 text-xs font-semibold rounded-xl cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
          <span>Lihat Timeline</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
