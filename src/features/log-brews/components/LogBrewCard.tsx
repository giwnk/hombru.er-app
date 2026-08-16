"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Coffee,
  Droplet,
  Gauge,
  MoreVertical,
  Pencil,
  Star,
  Thermometer,
  Timer,
  Trash2,
  Eye,
  SlidersHorizontal,
  Wrench,
  Workflow,
  Beaker,
  Percent,
} from "lucide-react";
import { LogBrew } from "../types/log-brews.types";
import { formatExtractionTime } from "../hooks/useFormat";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface LogBrewCardProps {
  log: LogBrew;
  onViewDetail: (log: LogBrew) => void;
  onEdit: (log: LogBrew) => void;
  onDelete: (log: LogBrew) => void;
}

export function LogBrewCard({
  log,
  onViewDetail,
  onEdit,
  onDelete,
}: LogBrewCardProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const beanName = log.bean?.product_name || "Biji Kopi";
  const roasteryName =
    log.bean?.roastery?.roastery_name ||
    log.bean?.roastery?.name ||
    log.bean?.roasteries?.roastery_name ||
    log.bean?.roasteries?.name;

  const pouringMethodName = log.pouring_method?.pour_name;
  const formattedTime = formatExtractionTime(log.extraction_time);
  const formattedDate = log.created_at
    ? new Date(log.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  const sensory = log.sensory_profile;

  return (
    <Card className="group relative border border-border/70 hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden bg-card flex flex-col justify-between">
      <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
        {/* 1. Header Card: Method Badge, Rating & Action Popover */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary hover:bg-primary/20 font-semibold px-2.5 py-0.5 text-xs rounded-full"
            >
              {log.method}
            </Badge>

            {pouringMethodName && (
              <Badge
                variant="outline"
                className="bg-background border-primary/30 text-primary font-medium text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1"
              >
                <Workflow className="w-3 h-3" />
                <span className="truncate max-w-[140px]">{pouringMethodName}</span>
              </Badge>
            )}

            {typeof log.overall_rating === "number" && log.overall_rating > 0 ? (
              <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-bold border border-primary/20">
                <Star className="w-3.5 h-3.5 fill-primary stroke-primary" />
                <span>{log.overall_rating.toFixed(1)}</span>
              </div>
            ) : null}
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
                    onViewDetail(log);
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
                    onEdit(log);
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
                    onDelete(log);
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Hapus
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* 2. Informasi Biji Kopi */}
        <div className="space-y-0.5">
          <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {beanName}
          </h3>
          {roasteryName && (
            <p className="text-xs text-muted-foreground line-clamp-1 font-medium">
              {roasteryName}
            </p>
          )}
        </div>

        {/* 3. Display Tools used if present */}
        {log.tools && log.tools.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 text-[11px] pt-0.5">
            <Wrench className="w-3 h-3 text-primary shrink-0 mr-0.5" />
            {log.tools.map((t) => (
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

        {/* 4. Parameter Seduh Grid (Detail Komprehensif) */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-muted/40 rounded-xl text-xs border border-border/40 space-y-0">
          <div className="flex items-center gap-2">
            <Coffee className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="font-medium text-foreground">
              {log.coffee_weight}g
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Droplet className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="font-medium text-foreground">
              {log.water_weight}g
              {log.ratio_coffee_water ? (
                <span className="text-muted-foreground ml-1 font-normal text-[11px]">
                  (1:{log.ratio_coffee_water})
                </span>
              ) : null}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Timer className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="font-medium text-foreground">{formattedTime}</span>
          </div>

          <div className="flex items-center gap-2">
            <Thermometer className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="font-medium text-foreground">
              {log.temperature && log.temperature > 0 ? `${log.temperature}°C` : "-"}
            </span>
          </div>

          {/* Liquid Yield / TDS if present */}
          {(Boolean(log.yield_weight && log.yield_weight > 0) || Boolean(log.tds && log.tds > 0)) && (
            <div className="flex items-center justify-between col-span-2 border-t border-border/30 pt-1.5 mt-1 text-[11px]">
              {log.yield_weight && log.yield_weight > 0 ? (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Beaker className="w-3 h-3 text-primary" /> Yield:{" "}
                  <strong className="text-foreground font-semibold">{log.yield_weight}g</strong>
                  {log.ratio_yield_coffee && (
                    <span className="text-[10px]"> (1:{log.ratio_yield_coffee})</span>
                  )}
                </span>
              ) : null}

              {log.tds && log.tds > 0 ? (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Percent className="w-3 h-3 text-primary" /> TDS:{" "}
                  <strong className="text-foreground font-semibold">{log.tds}%</strong>
                </span>
              ) : null}
            </div>
          )}

          {log.grind_size_actual && (
            <div className="flex items-center gap-2 col-span-2 border-t border-border/30 pt-1.5 mt-0.5">
              <Gauge className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="text-muted-foreground">Gilingan:</span>
              <span className="font-medium text-foreground truncate">
                {log.grind_size_actual}
              </span>
            </div>
          )}
        </div>

        {/* 5. Sensory Sliders Visual Indicators */}
        {sensory && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <SlidersHorizontal className="w-3 h-3 text-primary" /> Profil Rasa
              </span>
              {typeof sensory.profile_accuracy === "number" && sensory.profile_accuracy > 0 ? (
                <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full text-[10px]">
                  Akurasi {sensory.profile_accuracy}/5
                </span>
              ) : null}
            </div>

            <div className="grid grid-cols-3 gap-1 text-[10px]">
              <div className="bg-muted/40 p-1.5 rounded-lg border border-border/30 flex flex-col items-center">
                <span className="text-muted-foreground">Manis</span>
                <span className="font-bold text-foreground">{sensory.sweetness ?? 0}/5</span>
              </div>
              <div className="bg-muted/40 p-1.5 rounded-lg border border-border/30 flex flex-col items-center">
                <span className="text-muted-foreground">Asam</span>
                <span className="font-bold text-foreground">{sensory.acidity ?? 0}/5</span>
              </div>
              <div className="bg-muted/40 p-1.5 rounded-lg border border-border/30 flex flex-col items-center">
                <span className="text-muted-foreground">Body</span>
                <span className="font-bold text-foreground">{sensory.body ?? 0}/5</span>
              </div>
              <div className="bg-muted/40 p-1.5 rounded-lg border border-border/30 flex flex-col items-center">
                <span className="text-muted-foreground">Clarity</span>
                <span className="font-bold text-foreground">{sensory.clarity ?? 0}/5</span>
              </div>
              <div className="bg-muted/40 p-1.5 rounded-lg border border-border/30 flex flex-col items-center">
                <span className="text-muted-foreground">Bitter</span>
                <span className="font-bold text-foreground">{sensory.bitterness ?? 0}/5</span>
              </div>
              <div className="bg-muted/40 p-1.5 rounded-lg border border-border/30 flex flex-col items-center">
                <span className="text-muted-foreground">Finish</span>
                <span className="font-bold text-foreground">{sensory.aftertaste ?? 0}/5</span>
              </div>
            </div>
          </div>
        )}

        {/* 6. Footer: Tanggal & Button Detail */}
        <div className="flex items-center justify-between border-t border-border/40 pt-3 text-xs">
          <span className="text-[11px] text-muted-foreground font-medium">
            {formattedDate}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs px-3 font-semibold text-primary hover:text-primary hover:bg-primary/10 cursor-pointer rounded-lg"
            onClick={() => onViewDetail(log)}
          >
            Lihat Detail
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
