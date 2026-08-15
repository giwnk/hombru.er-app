"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { GRIND_CATEGORIES } from "../constants/grind-settings.constant";
import { Tool } from "../types/tools.type";
import { SaveGrindSettingsPayload } from "../types/grind-settings.types";
import {
  grindSettingsFormSchema,
  GrindSettingsFormInput,
} from "../types/grind-settings.schema";
import {
  useGetGrindSettingsByToolId,
  useSaveGrindSettings,
  useResetGrindSettings,
} from "../hooks/useGrindSettings";
import { Loader2, RotateCcw, Sliders } from "lucide-react";

interface GrindSettingsSheetProps {
  isOpen?: boolean;
  onClose?: () => void;
  tool?: Tool | null;
  toolName?: string;
  brand?: string;
}

// Hint metode seduh per kategori untuk kejelasan UI
const CATEGORY_HINTS: Record<string, string> = {
  "Super Fine": "Turkish / Ibrik",
  Fine: "Espresso",
  "Fine to Medium": "Moka Pot / Aeropress",
  Medium: "V60 / Pour Over",
  "Medium to Coarse": "Chemex / Clever Dripper",
  Coarse: "French Press / Cupping",
  "Super Coarse": "Cold Brew",
};

export default function GrindSettingsSheet({
  isOpen = true,
  onClose,
  tool,
  toolName,
  brand,
}: GrindSettingsSheetProps) {
  const activeToolId = tool?.id || "";
  const displayName = tool?.tool_name || toolName || "Comandante C40";
  const displayBrand = tool?.brand || brand || "Comandante";

  // Fetch data kalibrasi dari Supabase
  const { data: settingsData, isLoading: isFetching } =
    useGetGrindSettingsByToolId(activeToolId);

  const saveMutation = useSaveGrindSettings();
  const resetMutation = useResetGrindSettings();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<GrindSettingsFormInput>({
    resolver: zodResolver(grindSettingsFormSchema),
    defaultValues: {
      tool_id: activeToolId,
      settings: GRIND_CATEGORIES.map((cat) => ({
        category: cat,
        min_value: "",
        max_value: "",
      })),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "settings",
  });

  // Sinkronkan data API ke Form saat data dimuat / sheet dibuka
  useEffect(() => {
    if (isOpen && activeToolId) {
      if (settingsData && settingsData.length > 0) {
        reset({
          tool_id: activeToolId,
          settings: settingsData.map((item) => ({
            category: item.category,
            min_value: item.min_value || "",
            max_value: item.max_value || "",
          })),
        });
      } else {
        reset({
          tool_id: activeToolId,
          settings: GRIND_CATEGORIES.map((cat) => ({
            category: cat,
            min_value: "",
            max_value: "",
          })),
        });
      }
    }
  }, [isOpen, activeToolId, settingsData, reset]);

  const isPending = saveMutation.isPending || resetMutation.isPending;

  const onSubmit = async (values: GrindSettingsFormInput) => {
    if (!activeToolId) return;
    try {
      await saveMutation.mutateAsync({
        tool_id: activeToolId,
        settings: values.settings as SaveGrindSettingsPayload["settings"],
      });
      onClose?.();
    } catch (error) {
      console.error("Gagal menyimpan kalibrasi gilingan:", error);
    }
  };

  const handleReset = async () => {
    if (!activeToolId) return;
    try {
      await resetMutation.mutateAsync(activeToolId);
      reset({
        tool_id: activeToolId,
        settings: GRIND_CATEGORIES.map((cat) => ({
          category: cat,
          min_value: "",
          max_value: "",
        })),
      });
    } catch (error) {
      console.error("Gagal mereset kalibrasi gilingan:", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col h-full overflow-hidden gap-0 border-l border-border"
      >
        {/* 1. Header Sheet (Fixed Top) */}
        <SheetHeader className="p-4 sm:p-5 border-b border-border/60 bg-muted/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Sliders className="h-5 w-5" />
            </div>
            <div className="min-w-0 pr-6">
              <SheetTitle className="text-base font-bold text-foreground">
                Kalibrasi Gilingan
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground pt-0.5 truncate">
                {displayName} {displayBrand && `• ${displayBrand}`}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* 2. Body Scrollable Middle */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-primary">💡 Panduan:</span> Masukkan nilai ukuran gilingan (klik / nomor dial) untuk setiap metode seduh. Kamu bisa mengisi nilai awal & akhir atau salah satunya saja.
          </div>

          {/* Header Kolom Tabel */}
          <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold text-muted-foreground px-1 pt-1">
            <div className="col-span-5">KATEGORI & METODE</div>
            <div className="col-span-3 text-center">AWAL (MIN)</div>
            <div className="col-span-1 text-center">-</div>
            <div className="col-span-3 text-center">AKHIR (MAX)</div>
          </div>

          {/* Form List 7 Baris Kategori */}
          <form id="grind-settings-form" onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
            {isFetching ? (
              // Loading Pulse Skeletons
              [1, 2, 3, 4, 5, 6, 7].map((n) => (
                <div
                  key={n}
                  className="h-12 w-full rounded-xl bg-muted/40 animate-pulse border border-border/40"
                />
              ))
            ) : (
              fields.map((field, index) => {
                const categoryName = field.category;
                const fieldError = errors.settings?.[index];

                return (
                  <div key={field.id} className="space-y-1">
                    <div className="grid grid-cols-12 gap-2 items-center rounded-xl border border-border/70 bg-muted/10 p-2.5 hover:border-primary/40 transition-colors">
                      {/* Hidden Category Field */}
                      <input
                        type="hidden"
                        {...register(`settings.${index}.category`)}
                      />

                      {/* Kategori & Hint */}
                      <div className="col-span-5 space-y-0.5 min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">
                          {categoryName}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {CATEGORY_HINTS[categoryName] || "Metode Seduh"}
                        </p>
                      </div>

                      {/* Input Min Value */}
                      <div className="col-span-3">
                        <Input
                          placeholder="Min"
                          disabled={isPending}
                          className="h-8 text-xs text-center px-1"
                          {...register(`settings.${index}.min_value`)}
                        />
                      </div>

                      {/* Strip Separator */}
                      <div className="col-span-1 text-center text-xs text-muted-foreground font-bold">
                        -
                      </div>

                      {/* Input Max Value */}
                      <div className="col-span-3">
                        <Input
                          placeholder="Max"
                          disabled={isPending}
                          className="h-8 text-xs text-center px-1"
                          {...register(`settings.${index}.max_value`)}
                        />
                      </div>
                    </div>

                    {/* Show Range Error if max_value < min_value */}
                    {fieldError?.max_value && (
                      <p className="text-[10px] text-destructive font-medium px-2">
                        {fieldError.max_value.message}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </form>
        </div>

        {/* 3. Footer Actions Sticky (Fixed Bottom) */}
        <SheetFooter className="border-t border-border/60 p-3.5 sm:p-4 bg-muted/20 shrink-0 flex-row items-center justify-between gap-2 mt-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isPending || isFetching}
            onClick={handleReset}
            className="h-8 text-xs cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 px-2.5"
          >
            {resetMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RotateCcw className="w-3.5 h-3.5" />
            )}
            <span>{resetMutation.isPending ? "Mereset..." : "Reset"}</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={onClose}
              className="h-8 text-xs cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              form="grind-settings-form"
              size="sm"
              disabled={isPending || isFetching || !isDirty}
              className="h-8 text-xs cursor-pointer font-semibold px-4 gap-1.5"
            >
              {saveMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>
                {saveMutation.isPending ? "Menyimpan..." : "Simpan Kalibrasi"}
              </span>
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}