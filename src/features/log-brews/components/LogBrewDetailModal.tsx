"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Coffee,
  Droplet,
  Gauge,
  Sliders,
  Star,
  Thermometer,
  Timer,
  Workflow,
  Wrench,
  X,
  Calendar,
  FileText,
  Beaker,
  Percent,
} from "lucide-react";
import { LogBrew } from "../types/log-brews.types";
import { formatExtractionTime } from "../hooks/useFormat";

interface LogBrewDetailModalProps {
  isOpen: boolean;
  log: LogBrew | null;
  onClose: () => void;
  onEdit?: (log: LogBrew) => void;
}

export function LogBrewDetailModal({
  isOpen,
  log,
  onClose,
  onEdit,
}: LogBrewDetailModalProps) {
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

  if (!isOpen || !log) return null;

  const bean = log.bean;
  const beanName = bean?.product_name || "Biji Kopi";
  const roasteryName =
    bean?.roastery?.roastery_name ||
    bean?.roastery?.name ||
    bean?.roasteries?.roastery_name ||
    bean?.roasteries?.name;

  const pouringMethod = log.pouring_method;
  const formattedTime = formatExtractionTime(log.extraction_time);
  const formattedDate = log.created_at
    ? new Date(log.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  const sensory = log.sensory_profile;

  const sensoryItems = [
    { label: "Sweetness (Manis)", value: sensory?.sweetness ?? 0 },
    { label: "Acidity (Keasaman)", value: sensory?.acidity ?? 0 },
    { label: "Body (Kepekatan)", value: sensory?.body ?? 0 },
    { label: "Clarity (Kejelasan Rasa)", value: sensory?.clarity ?? 0 },
    { label: "Bitterness (Kepahitan)", value: sensory?.bitterness ?? 0 },
    { label: "Aftertaste (Finish)", value: sensory?.aftertaste ?? 0 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary font-bold text-xs rounded-full px-3 py-1"
            >
              {log.method}
            </Badge>
            <h2 className="font-sans text-base font-bold text-foreground">
              Detail Catatan Seduh
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
          {/* Header Info Biji Kopi & Overall Rating */}
          <div className="flex items-start justify-between gap-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
            <div className="space-y-1 flex-1 min-w-0">
              <span className="text-[10px] font-bold tracking-widest text-primary uppercase flex items-center gap-1">
                <Coffee className="w-3 h-3" /> Biji Kopi yang Digunakan
              </span>
              <h3 className="text-lg font-extrabold text-foreground truncate">{beanName}</h3>
              {roasteryName && (
                <p className="text-xs font-medium text-muted-foreground">
                  Roastery: <strong className="text-foreground">{roasteryName}</strong>
                </p>
              )}

              {/* Bean metadata badges if available */}
              {(bean?.country_of_origin || bean?.processing || bean?.roast_level || bean?.varietal) && (
                <div className="flex flex-wrap gap-1 pt-1.5">
                  {bean.country_of_origin && (
                    <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-background">
                      {bean.country_of_origin}
                    </Badge>
                  )}
                  {bean.processing && (
                    <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-background">
                      {bean.processing}
                    </Badge>
                  )}
                  {bean.roast_level && (
                    <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-background">
                      {bean.roast_level}
                    </Badge>
                  )}
                  {bean.varietal && (
                    <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-background">
                      {bean.varietal}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {typeof log.overall_rating === "number" && log.overall_rating > 0 ? (
              <div className="flex flex-col items-center justify-center bg-primary/10 text-primary p-3 rounded-2xl min-w-[80px] border border-primary/20 shrink-0">
                <Star className="w-6 h-6 fill-primary stroke-primary mb-1" />
                <span className="font-extrabold text-lg leading-none">
                  {log.overall_rating.toFixed(1)}
                </span>
                <span className="text-[9px] text-muted-foreground font-semibold mt-1">
                  Overall Rating
                </span>
              </div>
            ) : null}
          </div>

          {/* Metode Penuangan Air (Pouring Method Detail Card) */}
          {pouringMethod && (
            <div className="space-y-2 bg-muted/20 p-4 rounded-2xl border border-border/50">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-foreground text-xs flex items-center gap-1.5">
                  <Workflow className="w-4 h-4 text-primary" />
                  Metode Penuangan: <span className="text-primary">{pouringMethod.pour_name}</span>
                </h4>
                <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary">
                  {pouringMethod.intervals?.length || 0} Step Penuangan
                </Badge>
              </div>

              {pouringMethod.description && (
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {pouringMethod.description}
                </p>
              )}

              {/* Intervals list preview */}
              {pouringMethod.intervals && pouringMethod.intervals.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {pouringMethod.intervals.map((step) => (
                    <div
                      key={step.step}
                      className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/40 text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 font-bold text-[10px] text-primary">
                          #{step.step}
                        </span>
                        <span className="font-semibold text-foreground">
                          {step.target_water}g
                        </span>
                      </div>
                      <div className="text-right text-[10px] text-muted-foreground">
                        {step.duration_seconds ? `${step.duration_seconds}s` : ""}
                        {step.notes ? ` • ${step.notes}` : ""}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tools List */}
          {log.tools && log.tools.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest border-b border-border/40 pb-1 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-primary" /> Alat Seduh yang Digunakan
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {log.tools.map((t) => (
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

          {/* Grid Spesifikasi Parameter Seduh Komprehensif */}
          <div className="space-y-2">
            <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest border-b border-border/40 pb-1">
              Spesifikasi & Parameter Seduh
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-muted/30 rounded-xl border border-border/40 space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                  <Coffee className="w-3.5 h-3.5 text-primary" /> Dosis Kopi
                </div>
                <p className="font-bold text-sm text-foreground">
                  {log.coffee_weight}g
                </p>
              </div>

              <div className="p-3 bg-muted/30 rounded-xl border border-border/40 space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                  <Droplet className="w-3.5 h-3.5 text-primary" /> Total Air & Ratio
                </div>
                <p className="font-bold text-sm text-foreground">
                  {log.water_weight}g
                  {log.ratio_coffee_water ? (
                    <span className="text-xs font-normal text-muted-foreground ml-1">
                      (1:{log.ratio_coffee_water})
                    </span>
                  ) : null}
                </p>
              </div>

              <div className="p-3 bg-muted/30 rounded-xl border border-border/40 space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                  <Timer className="w-3.5 h-3.5 text-primary" /> Waktu Seduh
                </div>
                <p className="font-bold text-sm text-foreground">{formattedTime}</p>
              </div>

              <div className="p-3 bg-muted/30 rounded-xl border border-border/40 space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                  <Thermometer className="w-3.5 h-3.5 text-primary" /> Suhu Air
                </div>
                <p className="font-bold text-sm text-foreground">
                  {log.temperature && log.temperature > 0 ? `${log.temperature}°C` : "-"}
                </p>
              </div>

              <div className="p-3 bg-muted/30 rounded-xl border border-border/40 space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                  <Gauge className="w-3.5 h-3.5 text-primary" /> Setting Gilingan
                </div>
                <p className="font-bold text-sm text-foreground truncate">
                  {log.grind_size_actual || "-"}
                </p>
              </div>

              <div className="p-3 bg-muted/30 rounded-xl border border-border/40 space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                  <Beaker className="w-3.5 h-3.5 text-primary" /> Yield & TDS
                </div>
                <p className="font-bold text-sm text-foreground">
                  {log.yield_weight && log.yield_weight > 0 ? `${log.yield_weight}g` : "-"}{" "}
                  {log.tds && log.tds > 0 ? `(${log.tds}%)` : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Sensory Profile Gauges Display dengan Progress Bar Visual */}
          {sensory && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border/40 pb-1">
                <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-primary" /> Profil Rasa (Sensory Profile)
                </h4>
                {typeof sensory.profile_accuracy === "number" && (
                  <span className="font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full text-xs">
                    Akurasi Profil: {sensory.profile_accuracy}/5
                  </span>
                )}
              </div>

              {/* Progress Bars for all 6 sensory attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/20 p-4 rounded-2xl border border-border/50">
                {sensoryItems.map((item) => (
                  <div
                    key={item.label}
                    className="p-3 bg-card rounded-xl border border-border/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">{item.label}</span>
                      <span className="font-extrabold text-primary">{item.value} / 5</span>
                    </div>
                    {/* Visual Progress Bar Gauge */}
                    <div className="w-full bg-secondary/80 rounded-full h-2 overflow-hidden border border-border/40">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(Math.min(item.value, 5) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {log.notes && (
            <div className="space-y-1.5">
              <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest border-b border-border/40 pb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary" /> Catatan Seduh / Evaluasi Rasa
              </h4>
              <div className="p-4 bg-muted/30 rounded-2xl border border-border/40 text-foreground leading-relaxed whitespace-pre-wrap text-xs font-medium">
                {log.notes}
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
                onEdit(log);
              }}
            >
              Edit Catatan Seduh
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
