"use client";

import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRightFromSquare,
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

interface CoffeeProductDetailModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CoffeeProductDetailModal({
  isOpen = true,
  onClose,
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
  const mockProduct = {
    id: "cp-1",
    product_name: "Ethiopia Guji Hambela",
    roastery: {
      name: "Space Roastery",
      country: "Indonesia",
      contact_info: "hello@spaceroastery.com",
    },
    country_of_origin: "Ethiopia",
    region: "Guji, Oromia",
    altitude: 1950,
    varietal: "Heirloom",
    processing: "Anaerobic Natural",
    roast_level: "Light Roast",
    flavour_profile: "Jasmine, Peach, Bergamot, Earl Grey, Honey",
    cupping_score: 88.5,
    weight: 250,
    price: 165000,
    product_image_url:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=600&auto=format&fit=crop",
    product_url: "https://spaceroastery.com",
    more_info:
      "Kopi edisi spesial dari wilayah Guji dengan profil rasa floral dan fruity yang intens. Sangat direkomendasikan diseduh dengan metode V60 rasio 1:15.",
    decaf: false,
  };

  const flavourTags = mockProduct.flavour_profile
    .split(",")
    .map((tag) => tag.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        {/* Header Modal & Image */}
        <div className="relative h-48 sm:h-56 w-full bg-muted overflow-hidden">
          {mockProduct.product_image_url ? (
            <Image
              src={mockProduct.product_image_url}
              alt={mockProduct.product_name}
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
          {mockProduct.cupping_score && (
            <div className="absolute bottom-3 left-4 flex items-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-md shadow-2xs">
              <Star className="w-3.5 h-3.5 fill-primary-foreground" />
              <span>{mockProduct.cupping_score} PTS</span>
            </div>
          )}
        </div>

        {/* Body Modal Detail */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Header Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-primary uppercase">
              <Coffee className="w-3.5 h-3.5" />
              <span>{mockProduct.roastery.name}</span>
            </div>

            <h2 className="font-sans text-xl font-bold text-foreground">
              {mockProduct.product_name}
            </h2>
          </div>

          {/* Origin, Region, & Altitude Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-muted/30 p-3 rounded-xl border border-border/50">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>
                Asal:{" "}
                <strong className="text-foreground font-semibold">
                  {mockProduct.country_of_origin}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>
                Region:{" "}
                <strong className="text-foreground font-semibold">
                  {mockProduct.region}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Mountain className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>
                Ketinggian:{" "}
                <strong className="text-foreground font-semibold">
                  {mockProduct.altitude} mdpl
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Scale className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>
                Berat:{" "}
                <strong className="text-foreground font-semibold">
                  {mockProduct.weight}g
                </strong>
              </span>
            </div>
          </div>

          {/* Processing & Roast Level Badges */}
          <div className="flex flex-wrap gap-2 items-center">
            {mockProduct.processing && (
              <Badge
                variant="secondary"
                className="bg-accent text-accent-foreground border border-border/50 text-xs px-2.5 py-1"
              >
                <Sparkles className="w-3 h-3 mr-1 text-primary" />
                {mockProduct.processing}
              </Badge>
            )}

            {mockProduct.roast_level && (
              <div className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground px-2.5 py-1 rounded-md border border-border/50 bg-muted/40">
                <Flame className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{mockProduct.roast_level}</span>
              </div>
            )}

            {mockProduct.varietal && (
              <span className="text-xs text-muted-foreground font-medium px-2.5 py-1 rounded-md border border-border/50 bg-muted/20">
                Varietas: {mockProduct.varietal}
              </span>
            )}
          </div>

          {/* Tasting Notes */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Tasting Notes
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {flavourTags.map((note, index) => (
                <span
                  key={index}
                  className="text-xs font-medium bg-secondary text-secondary-foreground px-2.5 py-1 rounded-md border border-border/40"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* More Info Catatan Tambahan */}
          {mockProduct.more_info && (
            <div className="space-y-1 bg-muted/20 p-3 rounded-xl border border-border/50 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-muted-foreground">
                <Info className="w-3.5 h-3.5 text-primary" />
                <span>Catatan Seduh / Keterangan</span>
              </div>
              <p className="text-muted-foreground leading-relaxed pt-0.5">
                {mockProduct.more_info}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions & Harga */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border/60 bg-muted/20">
          <div>
            <span className="text-[10px] text-muted-foreground block">
              Harga
            </span>
            <span className="text-lg font-bold text-foreground">
              Rp {mockProduct.price.toLocaleString("id-ID")}
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
            {mockProduct.product_url && (
              <Button
                className="gap-1.5 h-9 text-xs rounded-xl px-4 font-semibold cursor-pointer"
                asChild
              >
                <a
                  href={mockProduct.product_url}
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
