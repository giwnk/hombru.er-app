"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TOOL_TYPES } from "../constants/tools.constant";
import { Tool, ToolType } from "../types/tools.type";
import { toolsSchema, ToolFormInput } from "../types/tools.schema";
import { useCreateTool, useUpdateTool } from "../hooks/useTools";
import { Loader2, Wrench, X } from "lucide-react";

interface ToolFormModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isEditMode?: boolean;
  initialData?: Tool | null;
}

export default function ToolFormModal({
  isOpen = true,
  onClose,
  isEditMode = false,
  initialData,
}: ToolFormModalProps) {
  const createMutation = useCreateTool();
  const updateMutation = useUpdateTool();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ToolFormInput>({
    resolver: zodResolver(toolsSchema),
    defaultValues: {
      tool_name: "",
      brand: "",
      tool_type: "grinder",
      model: "",
      notes: "",
    },
  });

  const selectedToolType = watch("tool_type");

  // Inisialisasi & Reset Form saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        reset({
          tool_name: initialData.tool_name,
          brand: initialData.brand,
          tool_type: initialData.tool_type,
          model: initialData.model || "",
          notes: initialData.notes || "",
        });
      } else {
        reset({
          tool_name: "",
          brand: "",
          tool_type: "grinder",
          model: "",
          notes: "",
        });
      }
    }
  }, [isOpen, isEditMode, initialData, reset]);

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (values: ToolFormInput) => {
    try {
      if (isEditMode && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          ...values,
        });
      } else {
        await createMutation.mutateAsync(values);
      }
      onClose?.();
    } catch (error) {
      console.error("Gagal menyimpan alat seduh:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all animate-in zoom-in-95 duration-200">
        {/* 1. Header Modal */}
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {isEditMode ? "Edit Alat Seduh" : "Tambah Alat Seduh Baru"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isEditMode
                  ? "Perbarui informasi alat seduh atau grinder kamu."
                  : "Masukkan alat seduh atau grinder baru ke dalam koleksimu."}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            disabled={isLoading}
            onClick={onClose}
            className="h-8 w-8 rounded-lg cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 2. Body Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5">
          {/* Row 1: Nama Alat & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="tool_name" className="text-xs font-semibold">
                Nama Alat / Grinder <span className="text-destructive">*</span>
              </Label>
              <Input
                id="tool_name"
                disabled={isLoading}
                placeholder="Contoh: Comandante C40"
                className="h-9 text-xs"
                {...register("tool_name")}
              />
              {errors.tool_name && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.tool_name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="brand" className="text-xs font-semibold">
                Nama Brand / Merek <span className="text-destructive">*</span>
              </Label>
              <Input
                id="brand"
                disabled={isLoading}
                placeholder="Contoh: Comandante"
                className="h-9 text-xs"
                {...register("brand")}
              />
              {errors.brand && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.brand.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Tipe Alat (Select Dropdown) & Seri/Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="tool_type" className="text-xs font-semibold">
                Tipe Alat Seduh <span className="text-destructive">*</span>
              </Label>
              <Select
                disabled={isLoading}
                value={selectedToolType}
                onValueChange={(val) => setValue("tool_type", val as ToolType)}
              >
                <SelectTrigger id="tool_type" className="h-9 text-xs">
                  <SelectValue placeholder="Pilih Tipe Alat" />
                </SelectTrigger>
                <SelectContent>
                  {TOOL_TYPES.map((type) => (
                    <SelectItem
                      key={type.value}
                      value={type.value}
                      className="text-xs"
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tool_type && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.tool_type.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="model" className="text-xs font-semibold">
                Seri / Model <span className="text-muted-foreground font-normal">(Opsional)</span>
              </Label>
              <Input
                id="model"
                disabled={isLoading}
                placeholder="Contoh: MK4 Nitro Blade"
                className="h-9 text-xs"
                {...register("model")}
              />
              {errors.model && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.model.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Catatan Tambahan */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-semibold">
              Catatan Tambahan <span className="text-muted-foreground font-normal">(Opsional)</span>
            </Label>
            <Textarea
              id="notes"
              disabled={isLoading}
              placeholder="Tambahkan catatan khusus seperti ukuran burr, bahan material, dll..."
              className="text-xs min-h-[80px] resize-none"
              {...register("notes")}
            />
            {errors.notes && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.notes.message}
              </p>
            )}
          </div>

          {/* 3. Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
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
                  : "Tambah Alat Seduh"}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}