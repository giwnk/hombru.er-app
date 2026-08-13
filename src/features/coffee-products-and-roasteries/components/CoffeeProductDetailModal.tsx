"use client";

import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRightFromSquare,
  Calendar,
  Coffee,
  Flame,
  Globe,
  Info,
  MapPin,
  Mountain,
  Scale,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import { CoffeeProduct } from "../types/coffee-products.type";

interface CoffeeProductDetailModalProps {
  product?: CoffeeProduct | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CoffeeProductDetailModal({
  isOpen = true,
  onClose,
  product
}: CoffeeProductDetailModalProps) {
  // Lock body scroll saat modal terbuka
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

  if (!isOpen) return null;

  // Mock Data Referensi
  const dataProduct = product

  const flavourTags = dataProduct?.flavour_profile
    ?.split(",")
    .map((tag) => tag.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        {/* Header Modal & Image */}
        <div className="relative h-48 sm:h-56 w-full bg-muted overflow-hidden">
          {dataProduct?.product_image_url ? (
            <Image
              src={dataProduct?.product_image_url}
              alt={dataProduct.product_name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              <Coffee className="h-12 w-12 stroke-[1.25]" />
            </div>
          )}

          <div className="absolute inset-0 from-card via-card/30 to-transparent" />

          {/* Close Button Floating */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-md text-foreground shadow-2xs hover:bg-background cursor-pointer"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Cupping Score Floating */}
          <div className="absolute bottom-3 left-4 flex items-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-md shadow-2xs">
            <Star className="w-3.5 h-3.5 fill-primary-foreground" />
            <span>{dataProduct?.cupping_score ? `${dataProduct.cupping_score} PTS` : "- PTS"}</span>
          </div>
        </div>

        {/* Body Modal Detail */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Header Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-primary uppercase">
              <Coffee className="w-3.5 h-3.5" />
              <span>
                {dataProduct?.roastery?.roastery_name ||
                  dataProduct?.roastery?.name ||
                  dataProduct?.roasteries?.roastery_name ||
                  dataProduct?.roasteries?.name ||
                  "-"}
              </span>
            </div>

            <h2 className="font-sans text-xl font-bold text-foreground">
              {dataProduct?.product_name || "-"}
            </h2>
          </div>

          {/* Origin, Region, & Altitude Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-muted/30 p-3 rounded-xl border border-border/50">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>
                Asal:{" "}
                <strong className="text-foreground font-semibold">
                  {dataProduct?.country_of_origin || "-"}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>
                Region:{" "}
                <strong className="text-foreground font-semibold">
                  {dataProduct?.region || "-"}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Mountain className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>
                Ketinggian:{" "}
                <strong className="text-foreground font-semibold">
                  {dataProduct?.altitude ? `${dataProduct.altitude} mdpl` : "-"}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Scale className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>
                Berat:{" "}
                <strong className="text-foreground font-semibold">
                  {dataProduct?.weight ? `${dataProduct.weight}g` : "-"}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground sm:col-span-2">
              <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>
                Tanggal Sangrai (Roast Date):{" "}
                <strong className="text-foreground font-semibold">
                  {dataProduct?.roast_date || "-"}
                </strong>
              </span>
            </div>
          </div>

          {/* Processing & Roast Level Badges */}
          <div className="flex flex-wrap gap-2 items-center">
            <Badge
              variant="secondary"
              className="bg-accent text-accent-foreground border border-border/50 text-xs px-2.5 py-1"
            >
              <Sparkles className="w-3 h-3 mr-1 text-primary" />
              {dataProduct?.processing || "Process: -"}
            </Badge>

            <div className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground px-2.5 py-1 rounded-md border border-border/50 bg-muted/40">
              <Flame className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{dataProduct?.roast_level || "Roast Level: -"}</span>
            </div>

            <span className="text-xs text-muted-foreground font-medium px-2.5 py-1 rounded-md border border-border/50 bg-muted/20">
              Varietas: {dataProduct?.varietal || "-"}
            </span>
          </div>

          {/* Tasting Notes */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Tasting Notes
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {flavourTags && flavourTags.length > 0 && flavourTags[0] !== "" ? (
                flavourTags.map((note, index) => (
                  <span
                    key={index}
                    className="text-xs font-medium bg-secondary text-secondary-foreground px-2.5 py-1 rounded-md border border-border/40"
                  >
                    {note}
                  </span>
                ))
              ) : (
                <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2.5 py-1 rounded-md border border-border/40">
                  -
                </span>
              )}
            </div>
          </div>

          {/* More Info Catatan Tambahan */}
          <div className="space-y-1 bg-muted/20 p-3 rounded-xl border border-border/50 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-muted-foreground">
              <Info className="w-3.5 h-3.5 text-primary" />
              <span>Catatan Seduh / Keterangan</span>
            </div>
            <p className="text-muted-foreground leading-relaxed pt-0.5">
              {dataProduct?.more_info || "-"}
            </p>
          </div>
        </div>

        {/* Footer Actions & Harga */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border/60 bg-muted/20">
          <div>
            <span className="text-[10px] text-muted-foreground block">
              Harga
            </span>
            <span className="text-lg font-bold text-foreground">
              {dataProduct?.price ? `Rp ${dataProduct.price.toLocaleString("id-ID")}` : "Rp -"}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-9 text-xs rounded-xl px-4 cursor-pointer"
              onClick={onClose}
            >
              Tutup
            </Button>
            {dataProduct?.product_url && (
              <Button
                className="gap-1.5 h-9 text-xs rounded-xl px-4 font-semibold cursor-pointer"
                asChild
              >
                <a
                  href={dataProduct.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Beli Sekarang</span>
                  <ArrowUpRightFromSquare className="w-3.5 h-3.5" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
