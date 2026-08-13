"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CloudCog,
  Coffee,
  DollarSign,
  Flame,
  Globe,
  ImageIcon,
  LinkIcon,
  Loader2,
  MapPin,
  Mountain,
  Scale,
  Sparkles,
  Star,
  Tag,
  X,
} from "lucide-react";
import {
  coffeeProductsSchema,
  CoffeeProductsFormInput,
} from "../types/coffee-products.schema";
import {
  useCreateCoffeeProduct,
  useGetRoasteries,
  useUpdateCoffeeProduct,
} from "../hooks/useCoffeeProducts";
import { CoffeeProduct } from "../types/coffee-products.type";

interface CoffeeProductFormModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isEditMode?: boolean;
  initialData?: CoffeeProduct | null;
}

export default function CoffeeProductFormModal({
  isOpen = true,
  onClose,
  isEditMode = false,
  initialData,
}: CoffeeProductFormModalProps) {
  // Hooks React Query untuk Create, Update, & Roasteries
  const createMutation = useCreateCoffeeProduct();
  const updateMutation = useUpdateCoffeeProduct();
  const { data: dbRoasteries } = useGetRoasteries();
  // Roasteries asli dari Database Supabase milik user
  const roasteryOptions = dbRoasteries || [];

  // Setup React Hook Form dengan Zod Schema
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CoffeeProductsFormInput>({
    resolver: zodResolver(coffeeProductsSchema),
    defaultValues: {
      product_name: "",
      roastery_id: "",
      country_of_origin: "",
      region: "",
      altitude: "",
      varietal: "",
      processing: "",
      roast_level: "",
      roast_date: "",
      flavour_profile: "",
      cupping_score: "",
      weight: "",
      price: "",
      decaf: false,
      product_image_url: "",
      product_url: "",
      more_info: "",
    },
  });

  // Effect untuk me-lock scroll background body saat modal terbuka
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

  // Effect untuk me-reset form jika dalam Mode Edit
  useEffect(() => {
    if (isOpen && isEditMode && initialData) {
      const selectedRoasteryId =
        initialData.roastery_id || initialData.roastery?.id || "";
      reset({
        product_name: initialData.product_name || "",
        roastery_id: selectedRoasteryId,
        country_of_origin: initialData.country_of_origin || "",
        region: initialData.region || "",
        altitude: initialData.altitude ? String(initialData.altitude) : "",
        varietal: initialData.varietal || "",
        processing: initialData.processing || "",
        roast_level: initialData.roast_level || "",
        roast_date: initialData.roast_date || "",
        flavour_profile: initialData.flavour_profile || "",
        cupping_score: initialData.cupping_score ? String(initialData.cupping_score) : "",
        weight: initialData.weight ? String(initialData.weight) : "",
        price: initialData.price ? String(initialData.price) : "",
        decaf: initialData.decaf || false,
        product_image_url: initialData.product_image_url || "",
        product_url: initialData.product_url || "",
        more_info: initialData.more_info || "",
      });
    } else if (isOpen && !isEditMode) {
      reset({
        product_name: "",
        roastery_id: "",
        country_of_origin: "",
        region: "",
        altitude: "",
        varietal: "",
        processing: "",
        roast_level: "",
        roast_date: "",
        flavour_profile: "",
        cupping_score: "",
        weight: "",
        price: "",
        decaf: false,
        product_image_url: "",
        product_url: "",
        more_info: "",
      });
    }
  }, [isOpen, isEditMode, initialData, reset, dbRoasteries]);

  // Handler Submit Form
  const onSubmit = async (values: CoffeeProductsFormInput) => {
    const parsedValues = coffeeProductsSchema.parse(values);

    if (isEditMode && initialData?.id) {
      await updateMutation.mutateAsync({
        id: initialData.id,
        ...parsedValues,
      });
    } else {
      await createMutation.mutateAsync(parsedValues);
    }
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        {/* 1. Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-primary" />
            <h2 className="font-sans text-lg font-bold text-foreground">
              {isEditMode ? "Edit Produk Kopi" : "Tambah Produk Kopi Baru"}
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

        {/* 2. Form Wrapper */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {/* Body Modal Scrollable */}
          <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
            {/* Section 1: Informasi Utama */}
            <div className="space-y-3">
              <h3 className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest border-b border-border/40 pb-1">
                1. Informasi Utama Produk
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* product_name */}
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="product_name" className="text-xs font-medium">
                    Nama Produk Kopi <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="product_name"
                    placeholder="Contoh: Ethiopia Guji Hambela"
                    className="h-9 text-xs rounded-lg bg-background border-border/60"
                    {...register("product_name")}
                  />
                  {errors.product_name && (
                    <p className="text-[11px] text-destructive">
                      {errors.product_name.message}
                    </p>
                  )}
                </div>

                {/* roastery_id (Official Shadcn Select Component) */}
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="roastery_id" className="text-xs font-medium">
                    Pilih Roastery <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="roastery_id"
                    render={({ field }) => (
                      <Select
                        key={field.value || "empty-roastery"}
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <SelectTrigger className="w-full h-9 text-xs rounded-lg bg-background border-border/60">
                          <SelectValue placeholder="-- Pilih Roastery --" />
                        </SelectTrigger>
                        <SelectContent>
                          {roasteryOptions.map((roastery) => (
                            <SelectItem key={roastery.id} value={roastery.id}>
                              {roastery.roastery_name || roastery.name || "Roastery Tanpa Nama"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.roastery_id && (
                    <p className="text-[11px] text-destructive">
                      {errors.roastery_id.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Karakteristik Asal & Sangrai */}
            <div className="space-y-3 pt-1">
              <h3 className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest border-b border-border/40 pb-1">
                2. Asal Kopi & Profil Sangrai
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* country_of_origin */}
                <div className="space-y-1">
                  <Label htmlFor="country_of_origin" className="text-xs font-medium">
                    Negara Asal (Origin)
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      id="country_of_origin"
                      placeholder="Contoh: Ethiopia / Indonesia"
                      className="pl-8 h-9 text-xs rounded-lg bg-background border-border/60"
                      {...register("country_of_origin")}
                    />
                  </div>
                </div>

                {/* region */}
                <div className="space-y-1">
                  <Label htmlFor="region" className="text-xs font-medium">
                    Wilayah / Region
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      id="region"
                      placeholder="Contoh: Guji, Oromia / Puntang"
                      className="pl-8 h-9 text-xs rounded-lg bg-background border-border/60"
                      {...register("region")}
                    />
                  </div>
                </div>

                {/* altitude */}
                <div className="space-y-1">
                  <Label htmlFor="altitude" className="text-xs font-medium">
                    Ketinggian Kebun (mdpl)
                  </Label>
                  <div className="relative">
                    <Mountain className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      id="altitude"
                      type="number"
                      placeholder="1950"
                      className="pl-8 h-9 text-xs rounded-lg bg-background border-border/60"
                      {...register("altitude")}
                    />
                  </div>
                  {errors.altitude && (
                    <p className="text-[11px] text-destructive">
                      {errors.altitude.message}
                    </p>
                  )}
                </div>

                {/* varietal */}
                <div className="space-y-1">
                  <Label htmlFor="varietal" className="text-xs font-medium">
                    Varietas Kopi
                  </Label>
                  <div className="relative">
                    <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      id="varietal"
                      placeholder="Contoh: Heirloom / Sigarar Utang"
                      className="pl-8 h-9 text-xs rounded-lg bg-background border-border/60"
                      {...register("varietal")}
                    />
                  </div>
                </div>

                {/* processing (Official Shadcn Select Component) */}
                <div className="space-y-1">
                  <Label htmlFor="processing" className="text-xs font-medium">
                    Metode Proses
                  </Label>
                  <Controller
                    control={control}
                    name="processing"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <SelectTrigger className="w-full h-9 text-xs rounded-lg bg-background border-border/60">
                          <SelectValue placeholder="-- Pilih Proses --" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Washed">Washed / Full Washed</SelectItem>
                          <SelectItem value="Natural">Natural / Dry Process</SelectItem>
                          <SelectItem value="Honey">Honey Process</SelectItem>
                          <SelectItem value="Anaerobic Natural">Anaerobic Natural</SelectItem>
                          <SelectItem value="Wet Hulled">Giling Basah (Wet Hulled)</SelectItem>
                          <SelectItem value="Experimental">Experimental / Anaerobic Slow Dry</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* roast_level (Official Shadcn Select Component) */}
                <div className="space-y-1">
                  <Label htmlFor="roast_level" className="text-xs font-medium">
                    Roast Level
                  </Label>
                  <Controller
                    control={control}
                    name="roast_level"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <SelectTrigger className="w-full h-9 text-xs rounded-lg bg-background border-border/60">
                          <SelectValue placeholder="-- Pilih Roast Level --" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Light Roast">Light Roast</SelectItem>
                          <SelectItem value="Medium-Light Roast">Medium-Light Roast</SelectItem>
                          <SelectItem value="Medium Roast">Medium Roast</SelectItem>
                          <SelectItem value="Medium-Dark Roast">Medium-Dark Roast</SelectItem>
                          <SelectItem value="Dark Roast">Dark Roast</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* roast_date (Official Shadcn Popover + Calendar DatePicker Component) */}
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="roast_date" className="text-xs font-medium">
                    Tanggal Sangrai (Roast Date)
                  </Label>
                  <Controller
                    control={control}
                    name="roast_date"
                    render={({ field }) => (
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Pilih tanggal sangrai..."
                      />
                    )}
                  />
                </div>

                {/* flavour_profile */}
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="flavour_profile" className="text-xs font-medium">
                    Tasting Notes (Pisahkan dengan koma)
                  </Label>
                  <Input
                    id="flavour_profile"
                    placeholder="Contoh: Jasmine, Peach, Bergamot, Earl Grey, Honey"
                    className="h-9 text-xs rounded-lg bg-background border-border/60"
                    {...register("flavour_profile")}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Metrik, Berat & Harga */}
            <div className="space-y-3 pt-1">
              <h3 className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest border-b border-border/40 pb-1">
                3. Skor Cupping, Berat & Harga
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* cupping_score */}
                <div className="space-y-1">
                  <Label htmlFor="cupping_score" className="text-xs font-medium">
                    Cupping Score (75-100)
                  </Label>
                  <div className="relative">
                    <Star className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      id="cupping_score"
                      type="number"
                      step="0.1"
                      placeholder="88.5"
                      className="pl-8 h-9 text-xs rounded-lg bg-background border-border/60"
                      {...register("cupping_score")}
                    />
                  </div>
                  {errors.cupping_score && (
                    <p className="text-[11px] text-destructive">
                      {errors.cupping_score.message}
                    </p>
                  )}
                </div>

                {/* weight */}
                <div className="space-y-1">
                  <Label htmlFor="weight" className="text-xs font-medium">
                    Berat bersih (Gram)
                  </Label>
                  <div className="relative">
                    <Scale className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      id="weight"
                      type="number"
                      placeholder="250"
                      className="pl-8 h-9 text-xs rounded-lg bg-background border-border/60"
                      {...register("weight")}
                    />
                  </div>
                  {errors.weight && (
                    <p className="text-[11px] text-destructive">
                      {errors.weight.message}
                    </p>
                  )}
                </div>

                {/* price */}
                <div className="space-y-1">
                  <Label htmlFor="price" className="text-xs font-medium">
                    Harga (Rp)
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      placeholder="165000"
                      className="pl-8 h-9 text-xs rounded-lg bg-background border-border/60"
                      {...register("price")}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-[11px] text-destructive">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                {/* decaf boolean checkbox (Shadcn Checkbox Component) */}
                <Controller
                  control={control}
                  name="decaf"
                  render={({ field }) => (
                    <div className="flex items-center gap-2 pt-2 sm:col-span-3">
                      <Checkbox
                        id="decaf"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="cursor-pointer"
                      />
                      <Label
                        htmlFor="decaf"
                        className="text-xs font-medium cursor-pointer"
                      >
                        Produk kopi Decaf (Bebas Kafein)
                      </Label>
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Section 4: URLs & Keterangan */}
            <div className="space-y-3 pt-1">
              <h3 className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest border-b border-border/40 pb-1">
                4. Gambar & Catatan Tambahan
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* product_image_url */}
                <div className="space-y-1">
                  <Label htmlFor="product_image_url" className="text-xs font-medium">
                    URL Gambar Produk
                  </Label>
                  <div className="relative">
                    <ImageIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      id="product_image_url"
                      placeholder="https://..."
                      className="pl-8 h-9 text-xs rounded-lg bg-background border-border/60"
                      {...register("product_image_url")}
                    />
                  </div>
                  {errors.product_image_url && (
                    <p className="text-[11px] text-destructive">
                      {errors.product_image_url.message}
                    </p>
                  )}
                </div>

                {/* product_url */}
                <div className="space-y-1">
                  <Label htmlFor="product_url" className="text-xs font-medium">
                    URL Pembelian / Website Toko
                  </Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      id="product_url"
                      placeholder="https://..."
                      className="pl-8 h-9 text-xs rounded-lg bg-background border-border/60"
                      {...register("product_url")}
                    />
                  </div>
                  {errors.product_url && (
                    <p className="text-[11px] text-destructive">
                      {errors.product_url.message}
                    </p>
                  )}
                </div>

                {/* more_info */}
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="more_info" className="text-xs font-medium">
                    Keterangan / Catatan Seduh Tambahan
                  </Label>
                  <textarea
                    id="more_info"
                    rows={3}
                    placeholder="Catatan mengenai rasio seduh yang disarankan atau cerita unik dibalik biji kopi ini..."
                    className="w-full p-2.5 text-xs rounded-lg bg-background border border-border/60 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
                    {...register("more_info")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Footer Action Buttons */}
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
                "Tambah Kopi"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


