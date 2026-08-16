"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  BookOpen,
  Check,
  ChevronDown,
  Coffee,
  Droplet,
  Gauge,
  HelpCircle,
  Loader2,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Star,
  Thermometer,
  Timer,
  Workflow,
  Wrench,
  X,
} from "lucide-react";
import { BREW_METHODS } from "../constants/log-brews.constant";
import {
  logBrewSchema,
  LogBrewFormValues,
} from "../types/log-brews.schema";
import { LogBrew } from "../types/log-brews.types";
import {
  useCreateLogBrew,
  useGetCoffeeProductsForSelect,
  useGetGrindSettingsForCheatsheet,
  useGetPouringMethodsForSelect,
  useGetToolsForSelect,
  useUpdateLogBrew,
} from "../hooks/useLogBrews";
import { calculateBrewratio, calculateYieldRatio } from "../hooks/useCalculate";
import { formatExtractionTime } from "../hooks/useFormat";

interface LogBrewFormModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isEditMode?: boolean;
  initialData?: LogBrew | null;
}

export function LogBrewFormModal({
  isOpen = true,
  onClose,
  isEditMode = false,
  initialData,
}: LogBrewFormModalProps) {
  const createMutation = useCreateLogBrew();
  const updateMutation = useUpdateLogBrew();

  const { data: dbBeans } = useGetCoffeeProductsForSelect();
  const { data: dbTools } = useGetToolsForSelect();
  const { data: dbPouringMethods } = useGetPouringMethodsForSelect();

  const coffeeBeans = dbBeans || [];
  const availableTools = dbTools || [];
  const pouringMethods = dbPouringMethods || [];

  // Stopwatch state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Cheatsheet Side Sheet state
  const [isCheatsheetOpen, setIsCheatsheetOpen] = useState(false);
  const [selectedGrinderId, setSelectedGrinderId] = useState<string | null>(null);

  const { data: cheatsheetGrindSettings, isLoading: isCheatsheetLoading } =
    useGetGrindSettingsForCheatsheet(selectedGrinderId);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LogBrewFormValues>({
    resolver: zodResolver(logBrewSchema),
    defaultValues: {
      bean_id: "",
      method: "V60",
      pouring_method_id: undefined,
      tool_ids: [],
      coffee_weight: 0,
      water_weight: 0,
      temperature: 0,
      grind_size_actual: "",
      extraction_time: 0,
      yield_weight: 0,
      tds: 0,
      overall_rating: 0,
      notes: "",
      sensory_profile: {
        sweetness: 0,
        acidity: 0,
        body: 0,
        clarity: 0,
        bitterness: 0,
        aftertaste: 0,
        profile_accuracy: 0,
      },
    },
  });

  // Watch values for live auto-ratio calculation
  const watchedCoffeeWeight = watch("coffee_weight");
  const watchedWaterWeight = watch("water_weight");
  const watchedYieldWeight = watch("yield_weight");
  const watchedToolIds = watch("tool_ids") || [];

  const calculatedRatio =
    watchedCoffeeWeight && watchedCoffeeWeight > 0 && watchedWaterWeight && watchedWaterWeight > 0
      ? calculateBrewratio(watchedCoffeeWeight, watchedWaterWeight)
      : null;

  const calculatedYieldRatio =
    watchedCoffeeWeight && watchedCoffeeWeight > 0 && watchedYieldWeight && watchedYieldWeight > 0
      ? calculateYieldRatio(watchedCoffeeWeight, watchedYieldWeight)
      : null;

  // Filter grinders from available tools
  const grinderTools = availableTools.filter(
    (t) => t.tool_type === "grinder" || t.tool_name.toLowerCase().includes("grind")
  );

  // Find if user selected any grinder in tool_ids
  const selectedGrindersInTools = availableTools.filter(
    (t) => watchedToolIds.includes(t.id) && (t.tool_type === "grinder" || t.tool_name.toLowerCase().includes("grind"))
  );

  // Lock scroll saat modal terbuka
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

  // Stopwatch timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          const next = prev + 1;
          setValue("extraction_time", next);
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, setValue]);

  // Sync initialData saat Edit Mode
  useEffect(() => {
    if (isOpen && isEditMode && initialData) {
      reset({
        bean_id: initialData.bean_id || "",
        method: initialData.method || "V60",
        pouring_method_id: initialData.pouring_method_id || undefined,
        tool_ids: initialData.tool_ids || [],
        coffee_weight: initialData.coffee_weight || 0,
        water_weight: initialData.water_weight || 0,
        temperature: initialData.temperature ?? 0,
        grind_size_actual: initialData.grind_size_actual || "",
        extraction_time: initialData.extraction_time || 0,
        yield_weight: initialData.yield_weight ?? 0,
        tds: initialData.tds ?? 0,
        overall_rating: initialData.overall_rating ?? 0,
        notes: initialData.notes || "",
        sensory_profile: {
          sweetness: initialData.sensory_profile?.sweetness ?? 0,
          acidity: initialData.sensory_profile?.acidity ?? 0,
          body: initialData.sensory_profile?.body ?? 0,
          clarity: initialData.sensory_profile?.clarity ?? 0,
          bitterness: initialData.sensory_profile?.bitterness ?? 0,
          aftertaste: initialData.sensory_profile?.aftertaste ?? 0,
          profile_accuracy: initialData.sensory_profile?.profile_accuracy ?? 0,
        },
      });
      setTimerSeconds(initialData.extraction_time || 0);
    } else if (isOpen && !isEditMode) {
      reset({
        bean_id: "",
        method: "V60",
        pouring_method_id: undefined,
        tool_ids: [],
        coffee_weight: 0,
        water_weight: 0,
        temperature: 0,
        grind_size_actual: "",
        extraction_time: 0,
        yield_weight: 0,
        tds: 0,
        overall_rating: 0,
        notes: "",
        sensory_profile: {
          sweetness: 0,
          acidity: 0,
          body: 0,
          clarity: 0,
          bitterness: 0,
          aftertaste: 0,
          profile_accuracy: 0,
        },
      });
      setTimerSeconds(0);
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

  const handleOpenCheatsheet = (grinderId?: string) => {
    const targetId =
      grinderId ||
      (selectedGrindersInTools.length > 0 ? selectedGrindersInTools[0].id : null) ||
      (grinderTools.length > 0 ? grinderTools[0].id : null);

    if (targetId) {
      setSelectedGrinderId(targetId);
      setIsCheatsheetOpen(true);
    }
  };

  const onSubmit = async (values: LogBrewFormValues) => {
    if (isEditMode && initialData?.id) {
      await updateMutation.mutateAsync({
        id: initialData.id,
        ...values,
      });
    } else {
      await createMutation.mutateAsync(values);
    }
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
        <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
          {/* Header Modal */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/20">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="font-sans text-lg font-bold text-foreground">
                {isEditMode ? "Edit Catatan Seduh" : "Tambah Catatan Seduh Baru"}
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

          {/* Form Body */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Section 1: Informasi Dasar & Biji Kopi */}
              <div className="space-y-3">
                <h3 className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest border-b border-border/40 pb-1 flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-primary" /> 1. Biji Kopi, Metode & Alat Seduh
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* bean_id */}
                  <div className="space-y-1 sm:col-span-2">
                    <Label htmlFor="bean_id" className="text-xs font-medium">
                      Pilih Biji Kopi <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="bean_id"
                      render={({ field }) => (
                        <Select
                          key={field.value || "empty-bean"}
                          onValueChange={field.onChange}
                          value={field.value || undefined}
                        >
                          <SelectTrigger className="w-full h-9 text-xs rounded-lg bg-background border-border/60">
                            <SelectValue placeholder="-- Pilih Biji Kopi Dari Katalog --" />
                          </SelectTrigger>
                          <SelectContent className="z-[70]">
                            {coffeeBeans.map((bean) => {
                              const roastery =
                                bean.roastery?.roastery_name ||
                                bean.roastery?.name ||
                                bean.roasteries?.roastery_name ||
                                bean.roasteries?.name;
                              return (
                                <SelectItem key={bean.id} value={bean.id}>
                                  {bean.product_name} {roastery ? `(${roastery})` : ""}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.bean_id && (
                      <p className="text-[11px] text-destructive">
                        {errors.bean_id.message}
                      </p>
                    )}
                  </div>

                  {/* method */}
                  <div className="space-y-1">
                    <Label htmlFor="method" className="text-xs font-medium">
                      Metode Seduh <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="method"
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || "V60"}
                        >
                          <SelectTrigger className="w-full h-9 text-xs rounded-lg bg-background border-border/60">
                            <SelectValue placeholder="-- Pilih Metode --" />
                          </SelectTrigger>
                          <SelectContent className="z-[70]">
                            {BREW_METHODS.map((m) => (
                              <SelectItem key={m.value} value={m.value}>
                                {m.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.method && (
                      <p className="text-[11px] text-destructive">
                        {errors.method.message}
                      </p>
                    )}
                  </div>

                  {/* pouring_method_id */}
                  <div className="space-y-1">
                    <Label htmlFor="pouring_method_id" className="text-xs font-medium flex items-center gap-1">
                      <Workflow className="w-3 h-3 text-primary" /> Metode Penuangan Air
                    </Label>
                    <Controller
                      control={control}
                      name="pouring_method_id"
                      render={({ field }) => (
                        <Select
                          key={field.value || "empty-pouring"}
                          onValueChange={field.onChange}
                          value={field.value || undefined}
                        >
                          <SelectTrigger className="w-full h-9 text-xs rounded-lg bg-background border-border/60">
                            <SelectValue placeholder="-- Pilih Teknik Penuangan --" />
                          </SelectTrigger>
                          <SelectContent className="z-[70]">
                            {pouringMethods.map((pm) => (
                              <SelectItem key={pm.id} value={String(pm.id)}>
                                {pm.pour_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {/* grind_size_actual dengan Cheatsheet Button */}
                  <div className="space-y-1 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="grind_size_actual" className="text-xs font-medium">
                        Setting / Ukuran Gilingan
                      </Label>
                      {(grinderTools.length > 0 || selectedGrindersInTools.length > 0) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[11px] px-2 text-primary hover:bg-primary/10 gap-1 cursor-pointer font-medium"
                          onClick={() => handleOpenCheatsheet()}
                        >
                          <HelpCircle className="w-3 h-3" />
                          <span>Cheatsheet Kalibrasi Gilingan</span>
                        </Button>
                      )}
                    </div>
                    <div className="relative">
                      <Gauge className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input
                        id="grind_size_actual"
                        placeholder="Contoh: 14 Clicks / Medium Fine"
                        className="pl-8 h-9 text-xs rounded-lg bg-background border-border/60"
                        {...register("grind_size_actual")}
                      />
                    </div>
                  </div>

                  {/* tool_ids Multi-Select Dropdown */}
                  <div className="space-y-1 sm:col-span-2 pt-1">
                    <Label className="text-xs font-medium flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-primary" /> Pilih Alat yang Digunakan (Multi-select)
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          type="button"
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
              </div>

              {/* Section 2: Resep & Parameter Ekstraksi */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between border-b border-border/40 pb-1">
                  <h3 className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-primary" /> 2. Parameter Resep & Ekstraksi
                  </h3>
                  {calculatedRatio ? (
                    <span className="text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                      Auto Ratio 1 : {calculatedRatio}
                    </span>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* coffee_weight */}
                  <div className="space-y-1">
                    <Label htmlFor="coffee_weight" className="text-xs font-medium">
                      Dosis Kopi (Gram) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="coffee_weight"
                      type="number"
                      step="0.1"
                      placeholder="0"
                      className="h-9 text-xs rounded-lg bg-background border-border/60"
                      {...register("coffee_weight", { valueAsNumber: true })}
                    />
                    {errors.coffee_weight && (
                      <p className="text-[11px] text-destructive">
                        {errors.coffee_weight.message}
                      </p>
                    )}
                  </div>

                  {/* water_weight */}
                  <div className="space-y-1">
                    <Label htmlFor="water_weight" className="text-xs font-medium">
                      Total Air (Gram) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="water_weight"
                      type="number"
                      step="0.1"
                      placeholder="0"
                      className="h-9 text-xs rounded-lg bg-background border-border/60"
                      {...register("water_weight", { valueAsNumber: true })}
                    />
                    {errors.water_weight && (
                      <p className="text-[11px] text-destructive">
                        {errors.water_weight.message}
                      </p>
                    )}
                  </div>

                  {/* temperature */}
                  <div className="space-y-1">
                    <Label htmlFor="temperature" className="text-xs font-medium">
                      Suhu Air (°C)
                    </Label>
                    <div className="relative">
                      <Thermometer className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input
                        id="temperature"
                        type="number"
                        placeholder="0"
                        className="pl-8 h-9 text-xs rounded-lg bg-background border-border/60"
                        {...register("temperature", { valueAsNumber: true })}
                      />
                    </div>
                  </div>

                  {/* extraction_time dengan Stopwatch Tool */}
                  <div className="space-y-1 sm:col-span-2">
                    <Label htmlFor="extraction_time" className="text-xs font-medium flex items-center justify-between">
                      <span>Durasi Ekstraksi</span>
                      <span className="font-mono text-primary font-bold">
                        {formatExtractionTime(timerSeconds)}
                      </span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Timer className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input
                          id="extraction_time"
                          type="number"
                          placeholder="Detik"
                          className="pl-8 h-9 text-xs rounded-lg bg-background border-border/60"
                          {...register("extraction_time", { valueAsNumber: true })}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setTimerSeconds(val);
                            setValue("extraction_time", val);
                          }}
                        />
                      </div>
                      {/* Stopwatch Live Button */}
                      <Button
                        type="button"
                        size="sm"
                        variant={isTimerRunning ? "destructive" : "secondary"}
                        className="h-9 text-xs px-3 gap-1 rounded-lg cursor-pointer"
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                      >
                        {isTimerRunning ? (
                          <>
                            <Pause className="w-3.5 h-3.5" /> Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" /> Start
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-9 text-xs px-2.5 rounded-lg cursor-pointer"
                        onClick={() => {
                          setIsTimerRunning(false);
                          setTimerSeconds(0);
                          setValue("extraction_time", 0);
                        }}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* yield_weight */}
                  <div className="space-y-1">
                    <Label htmlFor="yield_weight" className="text-xs font-medium">
                      Hasil Liquid / Yield (g)
                    </Label>
                    <Input
                      id="yield_weight"
                      type="number"
                      step="0.1"
                      placeholder="0"
                      className="h-9 text-xs rounded-lg bg-background border-border/60"
                      {...register("yield_weight", { valueAsNumber: true })}
                    />
                    {calculatedYieldRatio && (
                      <span className="text-[10px] text-muted-foreground">
                        Yield Ratio 1:{calculatedYieldRatio}
                      </span>
                    )}
                  </div>

                  {/* tds */}
                  <div className="space-y-1">
                    <Label htmlFor="tds" className="text-xs font-medium">
                      TDS (%)
                    </Label>
                    <Input
                      id="tds"
                      type="number"
                      step="0.01"
                      placeholder="0"
                      className="h-9 text-xs rounded-lg bg-background border-border/60"
                      {...register("tds", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Evaluasi & Sensory Profile */}
              <div className="space-y-4 pt-1">
                <h3 className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest border-b border-border/40 pb-1 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-primary" /> 3. Evaluasi Rasa & Sensory Sliders
                </h3>

                {/* overall_rating Slider */}
                <div className="space-y-3 bg-muted/30 p-4 rounded-xl border border-border/50">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 font-bold text-xs sm:text-sm text-foreground">
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      <span>Overall Rating (Penilaian Keseluruhan)</span>
                    </Label>
                    <Controller
                      control={control}
                      name="overall_rating"
                      render={({ field }) => (
                        <span className="font-extrabold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-xs sm:text-sm shadow-2xs">
                          {(field.value ?? 0).toFixed(1)} / 5.0
                        </span>
                      )}
                    />
                  </div>
                  <Controller
                    control={control}
                    name="overall_rating"
                    render={({ field }) => (
                      <Slider
                        min={0}
                        max={5}
                        step={0.5}
                        value={[field.value ?? 0]}
                        onValueChange={(val) => field.onChange(val[0])}
                        className="cursor-pointer py-2"
                      />
                    )}
                  />
                </div>

                {/* Sliders Grid for Sensory Profile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-2xl border border-border/50">
                  {/* profile_accuracy Slider */}
                  <div className="space-y-3 sm:col-span-2 border-b border-border/40 pb-4">
                    <div className="flex items-start sm:items-center justify-between gap-2">
                      <div>
                        <Label className="font-bold text-xs sm:text-sm text-primary flex items-center gap-1.5">
                          <span>Akurasi Profil Rasa (Profile Accuracy)</span>
                        </Label>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Seberapa akurat hasil seduhan dengan karakter biji kopi yang diharapkan
                        </p>
                      </div>
                      <Controller
                        control={control}
                        name="sensory_profile.profile_accuracy"
                        render={({ field }) => (
                          <span className="font-extrabold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-xs shadow-2xs shrink-0">
                            {field.value ?? 0} / 5
                          </span>
                        )}
                      />
                    </div>

                    <Controller
                      control={control}
                      name="sensory_profile.profile_accuracy"
                      render={({ field }) => (
                        <Slider
                          min={0}
                          max={5}
                          step={1}
                          value={[field.value ?? 0]}
                          onValueChange={(val) => field.onChange(val[0])}
                          className="cursor-pointer py-2"
                        />
                      )}
                    />
                  </div>

                  {/* Sweetness Slider */}
                  <div className="space-y-3 bg-card p-3.5 rounded-xl border border-border/40 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold text-xs text-foreground">Sweetness (Manis)</Label>
                      <Controller
                        control={control}
                        name="sensory_profile.sweetness"
                        render={({ field }) => (
                          <span className="font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full text-[11px]">
                            {field.value ?? 0} / 5
                          </span>
                        )}
                      />
                    </div>
                    <Controller
                      control={control}
                      name="sensory_profile.sweetness"
                      render={({ field }) => (
                        <Slider
                          min={0}
                          max={5}
                          step={1}
                          value={[field.value ?? 0]}
                          onValueChange={(val) => field.onChange(val[0])}
                          className="cursor-pointer py-2"
                        />
                      )}
                    />
                  </div>

                  {/* Acidity Slider */}
                  <div className="space-y-3 bg-card p-3.5 rounded-xl border border-border/40 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold text-xs text-foreground">Acidity (Keasaman)</Label>
                      <Controller
                        control={control}
                        name="sensory_profile.acidity"
                        render={({ field }) => (
                          <span className="font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full text-[11px]">
                            {field.value ?? 0} / 5
                          </span>
                        )}
                      />
                    </div>
                    <Controller
                      control={control}
                      name="sensory_profile.acidity"
                      render={({ field }) => (
                        <Slider
                          min={0}
                          max={5}
                          step={1}
                          value={[field.value ?? 0]}
                          onValueChange={(val) => field.onChange(val[0])}
                          className="cursor-pointer py-2"
                        />
                      )}
                    />
                  </div>

                  {/* Body Slider */}
                  <div className="space-y-3 bg-card p-3.5 rounded-xl border border-border/40 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold text-xs text-foreground">Body (Kepekatan)</Label>
                      <Controller
                        control={control}
                        name="sensory_profile.body"
                        render={({ field }) => (
                          <span className="font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full text-[11px]">
                            {field.value ?? 0} / 5
                          </span>
                        )}
                      />
                    </div>
                    <Controller
                      control={control}
                      name="sensory_profile.body"
                      render={({ field }) => (
                        <Slider
                          min={0}
                          max={5}
                          step={1}
                          value={[field.value ?? 0]}
                          onValueChange={(val) => field.onChange(val[0])}
                          className="cursor-pointer py-2"
                        />
                      )}
                    />
                  </div>

                  {/* Clarity Slider */}
                  <div className="space-y-3 bg-card p-3.5 rounded-xl border border-border/40 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold text-xs text-foreground">Clarity (Kejelasan Rasa)</Label>
                      <Controller
                        control={control}
                        name="sensory_profile.clarity"
                        render={({ field }) => (
                          <span className="font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full text-[11px]">
                            {field.value ?? 0} / 5
                          </span>
                        )}
                      />
                    </div>
                    <Controller
                      control={control}
                      name="sensory_profile.clarity"
                      render={({ field }) => (
                        <Slider
                          min={0}
                          max={5}
                          step={1}
                          value={[field.value ?? 0]}
                          onValueChange={(val) => field.onChange(val[0])}
                          className="cursor-pointer py-2"
                        />
                      )}
                    />
                  </div>

                  {/* Bitterness Slider */}
                  <div className="space-y-3 bg-card p-3.5 rounded-xl border border-border/40 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold text-xs text-foreground">Bitterness (Kepahitan)</Label>
                      <Controller
                        control={control}
                        name="sensory_profile.bitterness"
                        render={({ field }) => (
                          <span className="font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full text-[11px]">
                            {field.value ?? 0} / 5
                          </span>
                        )}
                      />
                    </div>
                    <Controller
                      control={control}
                      name="sensory_profile.bitterness"
                      render={({ field }) => (
                        <Slider
                          min={0}
                          max={5}
                          step={1}
                          value={[field.value ?? 0]}
                          onValueChange={(val) => field.onChange(val[0])}
                          className="cursor-pointer py-2"
                        />
                      )}
                    />
                  </div>

                  {/* Aftertaste Slider */}
                  <div className="space-y-3 bg-card p-3.5 rounded-xl border border-border/40 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold text-xs text-foreground">Aftertaste (Finish)</Label>
                      <Controller
                        control={control}
                        name="sensory_profile.aftertaste"
                        render={({ field }) => (
                          <span className="font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full text-[11px]">
                            {field.value ?? 0} / 5
                          </span>
                        )}
                      />
                    </div>
                    <Controller
                      control={control}
                      name="sensory_profile.aftertaste"
                      render={({ field }) => (
                        <Slider
                          min={0}
                          max={5}
                          step={1}
                          value={[field.value ?? 0]}
                          onValueChange={(val) => field.onChange(val[0])}
                          className="cursor-pointer py-2"
                        />
                      )}
                    />
                  </div>
                </div>

                {/* notes */}
                <div className="space-y-1">
                  <Label htmlFor="notes" className="text-xs font-medium">
                    Catatan Seduh / Evaluasi Rasa
                  </Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    placeholder="Catatan mengenai ekstraksi rasa, acidity, body, atau masukan untuk seduhan berikutnya..."
                    className="w-full text-xs rounded-lg bg-background border-border/60"
                    {...register("notes")}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-border/60 bg-muted/20">
              <Button
                type="button"
                variant="outline"
                className="h-8 text-xs rounded-lg px-4 cursor-pointer"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-8 text-xs rounded-lg px-5 font-semibold cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : isEditMode ? (
                  "Simpan Perubahan"
                ) : (
                  "Simpan Jurnal Seduh"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Grinder Calibration Cheatsheet Side Sheet */}
      <Sheet open={isCheatsheetOpen} onOpenChange={setIsCheatsheetOpen}>
        <SheetContent side="right" className="p-6 overflow-y-auto space-y-4 z-[80]">
          <SheetHeader className="p-0 border-b border-border/60 pb-3">
            <SheetTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Gauge className="w-5 h-5 text-primary" />
              Cheatsheet Kalibrasi Gilingan
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Panduan rentang setting gilingan kopi berdasarkan alat grinder milikmu.
            </SheetDescription>
          </SheetHeader>

          {/* Grinder Selector in Cheatsheet */}
          {grinderTools.length > 1 && (
            <div className="space-y-1">
              <Label className="text-xs font-medium">Pilih Grinder</Label>
              <Select
                value={selectedGrinderId || undefined}
                onValueChange={setSelectedGrinderId}
              >
                <SelectTrigger className="w-full h-8 text-xs bg-background">
                  <SelectValue placeholder="-- Pilih Grinder --" />
                </SelectTrigger>
                <SelectContent className="z-[90]">
                  {grinderTools.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.tool_name} {g.brand ? `(${g.brand})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {isCheatsheetLoading ? (
            <div className="flex items-center justify-center py-8 text-xs text-muted-foreground gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Memuat kalibrasi...</span>
            </div>
          ) : !cheatsheetGrindSettings || cheatsheetGrindSettings.length === 0 ? (
            <p className="text-xs text-muted-foreground py-6 text-center italic">
              Belum ada data kalibrasi terdaftar untuk grinder ini. Kamu dapat mengatur rentang kalibrasi di menu Alat & Kalibrasi.
            </p>
          ) : (
            <div className="space-y-3 pt-2">
              {cheatsheetGrindSettings.map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between p-3 bg-muted/30 border border-border/50 rounded-xl text-xs"
                >
                  <span className="font-semibold text-foreground">{item.category}</span>
                  <div className="flex items-center gap-1">
                    {item.min_value || item.max_value ? (
                      <Badge variant="secondary" className="bg-primary/10 text-primary font-bold">
                        {item.min_value || "-"} {item.max_value ? `s.d ${item.max_value}` : ""}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-[11px] italic">Belum diatur</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
