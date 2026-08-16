"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PouringMethod } from "../types/pouring-methods.types";
import {
  pouringMethodSchema,
  PouringMethodFormInput,
} from "../types/pouring-methods.schema";
import {
  useCreatePouringMethod,
  useUpdatePouringMethod,
} from "../hooks/usePouringMethods";
import {
  Loader2,
  Plus,
  Trash2,
  Workflow,
  X,
} from "lucide-react";

interface PouringMethodFormModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isEditMode?: boolean;
  initialData?: PouringMethod | null;
}

export default function PouringMethodFormModal({
  isOpen = true,
  onClose,
  isEditMode = false,
  initialData,
}: PouringMethodFormModalProps) {
  const createMutation = useCreatePouringMethod();
  const updateMutation = useUpdatePouringMethod();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PouringMethodFormInput>({
    resolver: zodResolver(pouringMethodSchema),
    defaultValues: {
      pour_name: "",
      description: "",
      intervals: [
        { step: 1, target_water: 60, duration_seconds: 45, notes: "Bloom" },
        { step: 2, target_water: 180, duration_seconds: 45, notes: "Penuangan ke-2" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "intervals",
  });

  // Inisialisasi & Reset Form saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          pour_name: isEditMode
            ? initialData.pour_name
            : `${initialData.pour_name} (Copy)`,
          description: initialData.description || "",
          intervals:
            initialData.intervals && initialData.intervals.length > 0
              ? initialData.intervals.map((item, idx) => ({
                  step: idx + 1,
                  target_water: item.target_water,
                  duration_seconds: item.duration_seconds || undefined,
                  notes: item.notes || "",
                }))
              : [
                  {
                    step: 1,
                    target_water: 60,
                    duration_seconds: 45,
                    notes: "Bloom",
                  },
                ],
        });
      } else {
        reset({
          pour_name: "",
          description: "",
          intervals: [
            { step: 1, target_water: 60, duration_seconds: 45, notes: "Bloom" },
            { step: 2, target_water: 180, duration_seconds: 45, notes: "Penuangan ke-2" },
          ],
        });
      }
    }
  }, [isOpen, isEditMode, initialData, reset]);

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (values: PouringMethodFormInput) => {
    try {
      // Pastikan urutan step konsisten dari 1 s/d N
      const formattedIntervals = values.intervals.map((item, idx) => ({
        step: idx + 1,
        target_water: Number(item.target_water),
        duration_seconds: item.duration_seconds
          ? Number(item.duration_seconds)
          : undefined,
        notes: item.notes?.trim() || undefined,
      }));

      if (isEditMode && initialData?.id && !initialData.is_system_template) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          pour_name: values.pour_name,
          description: values.description,
          intervals: formattedIntervals,
        });
      } else {
        await createMutation.mutateAsync({
          pour_name: values.pour_name,
          description: values.description,
          intervals: formattedIntervals,
        });
      }
      onClose?.();
    } catch (error) {
      console.error("Gagal menyimpan metode penuangan:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all animate-in zoom-in-95 duration-200">
        {/* 1. Header Modal */}
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4 bg-muted/20 shrink-0">
          <div className="flex items-center gap-3 pr-4 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Workflow className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-foreground truncate">
                {isEditMode
                  ? "Edit Metode Penuangan"
                  : "Tambah Metode Penuangan Baru"}
              </h2>
              <p className="text-xs text-muted-foreground truncate">
                Atur tahapan & target penuangan air untuk seduhan kopi kamu.
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            disabled={isLoading}
            onClick={onClose}
            className="h-8 w-8 rounded-lg cursor-pointer text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 2. Body Form Scrollable */}
        <form
          id="pouring-method-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-5 space-y-4"
        >
          {/* Nama Metode & Deskripsi */}
          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="pour_name" className="text-xs font-semibold">
                Nama Metode Penuangan <span className="text-destructive">*</span>
              </Label>
              <Input
                id="pour_name"
                disabled={isLoading}
                placeholder="Contoh: V60 4:6 Method, Hoffmann 2-Pour..."
                className="h-9 text-xs"
                {...register("pour_name")}
              />
              {errors.pour_name && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.pour_name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold">
                Deskripsi / Panduan Teknik <span className="text-muted-foreground font-normal">(Opsional)</span>
              </Label>
              <Textarea
                id="description"
                disabled={isLoading}
                placeholder="Jelaskan teknik atau panduan ekstraksi metode penuangan ini..."
                className="text-xs min-h-[70px] resize-none"
                {...register("description")}
              />
            </div>
          </div>

          {/* Section Dynamic Interval Steps */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  Tahapan Penuangan Air (Pour Steps) <span className="text-destructive">*</span>
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Tambahkan setiap langkah penuangan air beserta akumulasi target gram & durasi.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isLoading}
                onClick={() =>
                  append({
                    step: fields.length + 1,
                    target_water: 0,
                    duration_seconds: 45,
                    notes: "",
                  })
                }
                className="h-7.5 text-xs rounded-xl gap-1 px-2.5 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Step</span>
              </Button>
            </div>

            {errors.intervals && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.intervals.message}
              </p>
            )}

            {/* List Field Array dengan Explicit Label untuk Setiap Step */}
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-2.5 rounded-2xl border border-border/70 bg-muted/10 p-3.5 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 font-bold text-xs text-primary">
                        #{index + 1}
                      </span>
                      <span className="text-xs font-bold text-foreground">
                        Step Penuangan Ke-{index + 1}
                      </span>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isLoading || fields.length <= 1}
                      onClick={() => remove(index)}
                      className="h-7 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer gap-1 px-2"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Hapus Step</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                    {/* Input Air (g) dengan Label */}
                    <div className="sm:col-span-4 space-y-1">
                      <Label
                        htmlFor={`water-${index}`}
                        className="text-[11px] font-semibold text-foreground"
                      >
                        Target Air (gram) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`water-${index}`}
                        type="number"
                        placeholder="Contoh: 60"
                        disabled={isLoading}
                        className="h-8.5 text-xs"
                        {...register(`intervals.${index}.target_water`, {
                          valueAsNumber: true,
                        })}
                      />
                      {errors.intervals?.[index]?.target_water && (
                        <p className="text-[10px] text-destructive font-medium">
                          {errors.intervals[index]?.target_water?.message}
                        </p>
                      )}
                    </div>

                    {/* Input Durasi (s) dengan Label */}
                    <div className="sm:col-span-4 space-y-1">
                      <Label
                        htmlFor={`duration-${index}`}
                        className="text-[11px] font-semibold text-foreground"
                      >
                        Durasi (detik) <span className="text-muted-foreground font-normal">(Opsional)</span>
                      </Label>
                      <Input
                        id={`duration-${index}`}
                        type="number"
                        placeholder="Contoh: 45"
                        disabled={isLoading}
                        className="h-8.5 text-xs"
                        {...register(`intervals.${index}.duration_seconds`, {
                          valueAsNumber: true,
                        })}
                      />
                    </div>

                    {/* Catatan / Teknik Step dengan Label */}
                    <div className="sm:col-span-4 space-y-1">
                      <Label
                        htmlFor={`notes-${index}`}
                        className="text-[11px] font-semibold text-foreground"
                      >
                        Catatan / Teknik <span className="text-muted-foreground font-normal">(Opsional)</span>
                      </Label>
                      <Input
                        id={`notes-${index}`}
                        placeholder="Contoh: Bloom / Spiral Pour"
                        disabled={isLoading}
                        className="h-8.5 text-xs"
                        {...register(`intervals.${index}.notes`)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* 3. Footer Actions */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-border/60 bg-muted/20 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={onClose}
            className="h-8 text-xs cursor-pointer"
          >
            Batal
          </Button>
          <Button
            type="submit"
            form="pouring-method-form"
            size="sm"
            disabled={isLoading || (isEditMode && !isDirty)}
            className="h-8 text-xs cursor-pointer font-semibold px-4 gap-1.5"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>
              {isLoading
                ? "Menyimpan..."
                : isEditMode
                ? "Simpan Perubahan"
                : "Simpan Metode"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
