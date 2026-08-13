"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Mail, Star, Store, X } from "lucide-react";
import {
  roasterySchema,
  RoasteryFormInput,
} from "../types/roastery.schema";
import {
  useCreateRoastery,
  useUpdateRoastery,
} from "../hooks/useRoasteries";
import { Roastery } from "../types/roastery.type";

interface RoasteryFormModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isEditMode?: boolean;
  initialData?: Roastery | null;
}

export default function RoasteryFormModal({
  isOpen = true,
  onClose,
  isEditMode = false,
  initialData,
}: RoasteryFormModalProps) {
  const createMutation = useCreateRoastery();
  const updateMutation = useUpdateRoastery();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoasteryFormInput>({
    resolver: zodResolver(roasterySchema),
    defaultValues: {
      roastery_name: "",
      country: "",
      contact_info: "",
      roastery_score: "",
      more_info: "",
    },
  });

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

  useEffect(() => {
    if (isEditMode && initialData) {
      reset({
        roastery_name: initialData.roastery_name || "",
        country: initialData.country || "",
        contact_info: initialData.contact_info || "",
        roastery_score: initialData.roastery_score ? String(initialData.roastery_score) : "",
        more_info: initialData.more_info || "",
      });
    } else {
      reset({
        roastery_name: "",
        country: "",
        contact_info: "",
        roastery_score: "",
        more_info: "",
      });
    }
  }, [isEditMode, initialData, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (values: RoasteryFormInput) => {
    const payload = {
      roastery_name: values.roastery_name,
      country: values.country || undefined,
      contact_info: values.contact_info || undefined,
      roastery_score: values.roastery_score ? Number(values.roastery_score) : undefined,
      more_info: values.more_info || undefined,
    };

    if (isEditMode && initialData?.id) {
      await updateMutation.mutateAsync({ id: initialData.id, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    onClose?.();
  };

  const isLoading = isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" />
            <h2 className="font-sans text-lg font-bold text-foreground">
              {isEditMode ? "Edit Roastery" : "Tambah Roastery Baru"}
            </h2>
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-xs font-medium">
              Nama Roastery <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Contoh: Space Roastery"
              className="h-9 text-xs rounded-lg bg-background border-border/60"
              {...register("roastery_name")}
            />
            {errors.roastery_name && (
              <p className="text-[11px] text-destructive">{errors.roastery_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="country" className="text-xs font-medium">
                Negara / Asal
              </Label>
              <div className="relative">
                <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  id="country"
                  placeholder="Indonesia"
                  className="pl-8 h-9 text-xs rounded-lg bg-background border-border/60"
                  {...register("country")}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="roastery_score" className="text-xs font-medium">
                Skor Roastery (1 - 10)
              </Label>
              <div className="relative">
                <Star className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  id="roastery_score"
                  type="number"
                  placeholder="9"
                  className="pl-8 h-9 text-xs rounded-lg bg-background border-border/60"
                  {...register("roastery_score")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="contact_info" className="text-xs font-medium">
              Kontak / Email / Website
            </Label>
            <div className="relative">
              <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                id="contact_info"
                placeholder="hello@spaceroastery.com"
                className="pl-8 h-9 text-xs rounded-lg bg-background border-border/60"
                {...register("contact_info")}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="more_info" className="text-xs font-medium">
              Catatan / Deskripsi Singkat
            </Label>
            <Input
              id="more_info"
              placeholder="Roaster spesialis micro-lot dari Yogyakarta..."
              className="h-9 text-xs rounded-lg bg-background border-border/60"
              {...register("more_info")}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              className="h-9 text-xs rounded-xl cursor-pointer"
              onClick={onClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-9 text-xs rounded-xl font-semibold cursor-pointer"
            >
              {isLoading ? "Menyimpan..." : isEditMode ? "Simpan Perubahan" : "Tambah Roastery"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
