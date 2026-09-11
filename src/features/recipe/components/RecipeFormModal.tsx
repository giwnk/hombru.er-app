"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BookOpen,
  ChevronDown,
  Coffee,
  Droplet,
  Gauge,
  Import,
  Loader2,
  Plus,
  Receipt,
  Thermometer,
  Timer,
  Trash2,
  Workflow,
  Wrench,
  X,
} from "lucide-react";
import {
  MEASUREMENT_UNITS,
  RECIPE_METHODS,
} from "../constants/recipes.constant";
import { recipeSchema, RecipeFormInput } from "../types/recipes.schema";
import { Recipe } from "../types/recipes.type";
import {
  useCreateRecipe,
  useGetLogBrewsForImport,
  useUpdateRecipe,
} from "../hooks/useRecipes";
import { useGetToolsForSelect } from "@/features/log-brews/hooks/useLogBrews";
import { formatExtractionTime } from "@/features/log-brews/hooks/useFormat";

interface RecipeFormModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isEditMode?: boolean;
  initialData?: Recipe | null;
}

export default function RecipeFormModal({
  isOpen = true,
  onClose,
  isEditMode = false,
  initialData,
}: RecipeFormModalProps) {
  const createMutation = useCreateRecipe();
  const updateMutation = useUpdateRecipe();

  const { data: dbTools } = useGetToolsForSelect();
  const { data: logBrews = [] } = useGetLogBrewsForImport();

  const availableTools = dbTools || [];

  // Selected LogBrew ID for Section 2
  const [selectedLogBrewId, setSelectedLogBrewId] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RecipeFormInput>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: "",
      method: "V60",
      description: "",
      instructions: "",
      tool_ids: [],
      log_brews_id: null,
      ingredients: [
        { name: "Biji Kopi", amount: 15, unit: "g" },
        { name: "Air Panas", amount: 225, unit: "g" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const watchedToolIds = watch("tool_ids") || [];
  const isLoading = createMutation.isPending || updateMutation.isPending;

  // Selected LogBrew object for preview card
  const selectedLogBrew = logBrews.find((l) => l.id === selectedLogBrewId);

  // Lock scroll when open
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

  // Reset form when modal opens / changes mode
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: isEditMode ? initialData.name : `${initialData.name} (Copy)`,
          method: initialData.method || "V60",
          description: initialData.description || "",
          instructions: initialData.instructions || "",
          tool_ids: initialData.tool_ids || [],
          log_brews_id: initialData.log_brews_id || null,
          ingredients:
            initialData.ingredients && initialData.ingredients.length > 0
              ? initialData.ingredients.map((ing) => ({
                  name: ing.name,
                  amount: Number(ing.amount) || 0,
                  unit: ing.unit || "g",
                  isImported: ing.isImported || false,
                  sourceBrewId: ing.sourceBrewId || "",
                }))
              : [
                  { name: "Biji Kopi", amount: 15, unit: "g" },
                  { name: "Air Panas", amount: 225, unit: "g" },
                ],
        });
        setSelectedLogBrewId(initialData.log_brews_id || "");
      } else {
        reset({
          name: "",
          method: "V60",
          description: "",
          instructions: "",
          tool_ids: [],
          log_brews_id: null,
          ingredients: [
            { name: "Biji Kopi", amount: 15, unit: "g" },
            { name: "Air Panas", amount: 225, unit: "g" },
          ],
        });
        setSelectedLogBrewId("");
      }
    }
  }, [isOpen, isEditMode, initialData, reset]);

  // Toggle selection tool
  const handleToggleTool = (toolId: string) => {
    const current = watchedToolIds || [];
    if (current.includes(toolId)) {
      setValue(
        "tool_ids",
        current.filter((id) => id !== toolId)
      );
    } else {
      setValue("tool_ids", [...current, toolId]);
    }
  };

  // Select/Unselect LogBrew in Section 2
  const handleSelectLogBrew = (logId: string) => {
    if (logId === "none") {
      setSelectedLogBrewId("");
      setValue("log_brews_id", null);
    } else {
      setSelectedLogBrewId(logId);
      setValue("log_brews_id", logId);
    }
  };

  const onSubmit = async (values: RecipeFormInput) => {
    try {
      const formattedIngredients = (values.ingredients || []).map((item) => ({
        name: item.name.trim(),
        amount: Number(item.amount),
        unit: item.unit,
        isImported: item.isImported || false,
        sourceBrewId: item.sourceBrewId || undefined,
      }));

      if (isEditMode && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          name: values.name,
          method: values.method,
          description: values.description,
          instructions: values.instructions,
          tool_ids: values.tool_ids,
          log_brews_id: values.log_brews_id,
          ingredients: formattedIngredients,
        });
      } else {
        await createMutation.mutateAsync({
          name: values.name,
          method: values.method,
          description: values.description,
          instructions: values.instructions,
          tool_ids: values.tool_ids,
          log_brews_id: values.log_brews_id,
          ingredients: formattedIngredients,
        });
      }
      onClose?.();
    } catch (error) {
      console.error("Gagal menyimpan resep:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all animate-in zoom-in-95 duration-200">
        {/* 1. Header Modal */}
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4 bg-muted/20 shrink-0">
          <div className="flex items-center gap-3 pr-4 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Receipt className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-foreground truncate">
                {isEditMode ? "Edit Resep Seduh" : "Buat Resep Seduh Baru"}
              </h2>
              <p className="text-xs text-muted-foreground truncate">
                Rancang takaran bahan, metode, dan instruksi racikan resep seduhan kopi.
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
          id="recipe-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-5 space-y-5 text-xs"
        >
          {/* Section Informasi Utama (Nama, Metode, Deskripsi, Instruksi) */}
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Nama Resep */}
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold">
                  Nama Resep Seduh <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  disabled={isLoading}
                  placeholder="Contoh: Japanese Iced Coffee V60, Aren Latte..."
                  className="h-9 text-xs"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-[11px] text-destructive font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Metode Seduh */}
              <div className="space-y-1.5">
                <Label htmlFor="method" className="text-xs font-semibold">
                  Metode Seduh <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="method"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || "V60"}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="w-full h-9 text-xs rounded-lg bg-background border-border/60">
                        <SelectValue placeholder="-- Pilih Metode --" />
                      </SelectTrigger>
                      <SelectContent className="z-[70]">
                        {RECIPE_METHODS.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.method && (
                  <p className="text-[11px] text-destructive font-medium">
                    {errors.method.message}
                  </p>
                )}
              </div>
            </div>

            {/* Deskripsi Resep */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold">
                Deskripsi Resep / Profil Rasa <span className="text-muted-foreground font-normal">(Opsional)</span>
              </Label>
              <Input
                id="description"
                disabled={isLoading}
                placeholder="Penjelasan singkat rasa, karakter kopi, atau variasi penyajian..."
                className="h-9 text-xs"
                {...register("description")}
              />
            </div>

            {/* Instruksi Pembuatan */}
            <div className="space-y-1.5">
              <Label htmlFor="instructions" className="text-xs font-semibold">
                Instruksi & Tahapan Pembuatan <span className="text-muted-foreground font-normal">(Opsional)</span>
              </Label>
              <Textarea
                id="instructions"
                disabled={isLoading}
                rows={3}
                placeholder="Tuliskan urutan penuangan, pencampuran, atau teknik ekstraksi resep ini..."
                className="text-xs min-h-[70px]"
                {...register("instructions")}
              />
            </div>

            {/* Multi-Select Tools */}
            <div className="space-y-1.5 pt-1">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-primary" /> Alat yang Digunakan <span className="text-muted-foreground font-normal">(Opsional)</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    className="w-full justify-between h-auto min-h-[36px] text-xs px-3 py-1.5 rounded-lg bg-background border-border/60 cursor-pointer"
                  >
                    {watchedToolIds.length === 0 ? (
                      <span className="text-muted-foreground font-normal">
                        -- Pilih Alat-Alat Seduh --
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1 items-center">
                        {watchedToolIds.map((tid) => {
                          const tool = availableTools.find((t) => t.id === tid);
                          return tool ? (
                            <Badge
                              key={tool.id}
                              variant="secondary"
                              className="bg-primary/10 text-primary hover:bg-primary/20 text-[11px] px-2 py-0.5 rounded-md font-medium"
                            >
                              {tool.tool_name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    )}
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2 bg-card border-border shadow-md z-[70]" align="start">
                  <div className="space-y-1 max-h-48 overflow-y-auto text-xs">
                    {availableTools.length === 0 ? (
                      <p className="p-2 text-muted-foreground text-center italic">
                        Belum ada alat terdaftar.
                      </p>
                    ) : (
                      availableTools.map((tool) => {
                        const isChecked = watchedToolIds.includes(tool.id);
                        return (
                          <div
                            key={tool.id}
                            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                            onClick={() => handleToggleTool(tool.id)}
                          >
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => handleToggleTool(tool.id)}
                              className="cursor-pointer"
                            />
                            <span className="font-medium text-foreground">
                              {tool.tool_name}
                            </span>
                            {tool.brand && (
                              <span className="text-muted-foreground text-[10px]">
                                ({tool.brand})
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* SECTION 1: INPUT BAHAN SECARA MANUAL (Dynamic Rows with Add Ingredient button) */}
          <div className="space-y-3 pt-3 border-t border-border/60">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-primary" /> SECTION 1: Input Bahan Secara Manual <span className="text-destructive">*</span>
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Tambahkan takaran bahan-bahan resep beserta jumlah & satuan pengukuran.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isLoading}
                onClick={() =>
                  append({ name: "", amount: 10, unit: "g" })
                }
                className="h-8 text-xs rounded-xl gap-1.5 px-3 cursor-pointer shrink-0 border-primary/40 text-primary hover:bg-primary/10"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Bahan</span>
              </Button>
            </div>

            {errors.ingredients && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.ingredients.message}
              </p>
            )}

            {/* List Row Input Bahan Manual */}
            <div className="space-y-2.5">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-border/60 bg-muted/20 hover:border-primary/40 transition-colors"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 font-bold text-xs text-primary shrink-0">
                    #{index + 1}
                  </span>

                  {/* Nama Bahan */}
                  <div className="flex-1 space-y-0.5">
                    <Input
                      placeholder="Nama Bahan (contoh: Biji Kopi, Air, Susu...)"
                      disabled={isLoading}
                      className="h-8 text-xs"
                      {...register(`ingredients.${index}.name`)}
                    />
                    {errors.ingredients?.[index]?.name && (
                      <p className="text-[10px] text-destructive font-medium">
                        {errors.ingredients[index]?.name?.message}
                      </p>
                    )}
                  </div>

                  {/* Amount / Jumlah */}
                  <div className="w-24 space-y-0.5">
                    <Input
                      type="number"
                      step="any"
                      placeholder="Jumlah"
                      disabled={isLoading}
                      className="h-8 text-xs"
                      {...register(`ingredients.${index}.amount`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  {/* Unit Dropdown */}
                  <div className="w-28 space-y-0.5">
                    <Controller
                      control={control}
                      name={`ingredients.${index}.unit`}
                      render={({ field: unitField }) => (
                        <Select
                          onValueChange={unitField.onChange}
                          value={unitField.value || "g"}
                          disabled={isLoading}
                        >
                          <SelectTrigger className="h-8 text-xs bg-background">
                            <SelectValue placeholder="Satuan" />
                          </SelectTrigger>
                          <SelectContent className="z-[80]">
                            {MEASUREMENT_UNITS.map((u) => (
                              <SelectItem key={u.value} value={u.value}>
                                {u.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {/* Delete Row Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isLoading || fields.length <= 1}
                    onClick={() => remove(index)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer shrink-0 rounded-lg"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: IMPORT DARI CATATAN SEDUH YANG SUDAH ADA */}
          <div className="space-y-3 pt-3 border-t border-border/60">
            <div>
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Import className="w-3.5 h-3.5 text-primary" /> SECTION 2: Tautkan Catatan Seduh <span className="text-muted-foreground font-normal">(Opsional)</span>
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Pilih dari jurnal seduhan kopi kamu yang sudah ada untuk menampilkan detail parameternya di bawah resep ini.
              </p>
            </div>

            <div className="space-y-3">
              {/* Dropdown Select Catatan Seduh */}
              <Select
                value={selectedLogBrewId || "none"}
                onValueChange={handleSelectLogBrew}
                disabled={isLoading || logBrews.length === 0}
              >
                <SelectTrigger className="w-full h-9 text-xs bg-background">
                  <SelectValue
                    placeholder={
                      logBrews.length === 0
                        ? "-- Belum Ada Catatan Seduh --"
                        : "-- Pilih Catatan Seduh untuk Ditautkan --"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="z-[70]">
                  <SelectItem value="none">-- Tanpa Tautan Catatan Seduh --</SelectItem>
                  {logBrews.map((log) => {
                    const beanLabel = log.bean?.product_name || "Biji Kopi";
                    const dateLabel = log.created_at
                      ? new Date(log.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })
                      : "";
                    return (
                      <SelectItem key={log.id} value={log.id}>
                        {log.method} • {beanLabel} ({log.coffee_weight}g / {log.water_weight}g) - {dateLabel}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              {/* CARD PREVIEW CATATAN SEDUH TERPILIH */}
              {selectedLogBrew && (
                <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 space-y-2.5 text-xs animate-in fade-in-0">
                  <div className="flex items-center justify-between border-b border-primary/20 pb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary font-bold">
                        {selectedLogBrew.method}
                      </Badge>
                      <span className="font-bold text-foreground truncate max-w-[200px]">
                        {selectedLogBrew.bean?.product_name || "Biji Kopi"}
                      </span>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectLogBrew("none")}
                      className="h-6 text-[10px] px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                    >
                      Lepas Tautan
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Coffee className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{selectedLogBrew.coffee_weight}g Kopi</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Droplet className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{selectedLogBrew.water_weight}g Air</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{selectedLogBrew.temperature ? `${selectedLogBrew.temperature}°C` : "-"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{formatExtractionTime(selectedLogBrew.extraction_time)}</span>
                    </div>
                  </div>

                  {selectedLogBrew.grind_size_actual && (
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground border-t border-primary/10 pt-1.5">
                      <Gauge className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>Gilingan: <strong className="text-foreground">{selectedLogBrew.grind_size_actual}</strong></span>
                    </div>
                  )}

                  {selectedLogBrew.pouring_method?.pour_name && (
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Workflow className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>Metode Penuangan: <strong className="text-foreground">{selectedLogBrew.pouring_method.pour_name}</strong></span>
                    </div>
                  )}
                </div>
              )}
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
            form="recipe-form"
            size="sm"
            disabled={isLoading}
            className="h-8 text-xs cursor-pointer font-semibold px-4 gap-1.5"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>
              {isLoading
                ? "Menyimpan..."
                : isEditMode
                ? "Simpan Perubahan"
                : "Simpan Resep"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
