"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  ArrowUpRightFromSquare,
  ChevronRight,
  Coffee,
  Flame,
  Globe,
  Pencil,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import Image from "next/image";

export default function CoffeeProductCard() {
  // Hardcoded data referensi untuk preview UI
  const mockProduct = {
    id: "cp-1",
    product_name: "Ethiopia Guji Hambela",
    roastery: {
      name: "Space Roastery",
      country: "Indonesia",
    },
    country_of_origin: "Ethiopia",
    region: "Guji, Oromia",
    altitude: 1950,
    processing: "Anaerobic Natural",
    roast_level: "Light Roast",
    flavour_profile: "Jasmine, Peach, Bergamot, Earl Grey, Honey",
    cupping_score: 88.5,
    weight: 250,
    price: 165000,
    product_image_url:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=600&auto=format&fit=crop",
    product_url: "https://spaceroastery.com",
    decaf: false,
  };

  // Ambil maksimal 3 tasting notes esensial
  const flavourTags = mockProduct.flavour_profile
    .split(",")
    .map((tag) => tag.trim())
    .slice(0, 3);

  return (
    <Card className="group relative overflow-hidden border border-border bg-card hover:border-primary/50 transition-all duration-300 rounded-xl max-w-2xs w-full shadow-2xs">
      {/* 1. Gambar & Badge Esensial */}
      <div className="relative h-36 w-full overflow-hidden bg-muted">
        {mockProduct.product_image_url ? (
          <Image
            src={mockProduct.product_image_url}
            alt={mockProduct.product_name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            <Coffee className="h-10 w-10 stroke-[1.25]" />
          </div>
        )}

        <div className="absolute inset-0 from-card via-card/20 to-transparent" />

        {/* Action Buttons Floating */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 cursor-pointer rounded-lg bg-background/90 border border-border/60 hover:bg-accent text-foreground shadow-2xs"
            onClick={() => console.log("Edit clicked")}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 cursor-pointer rounded-lg bg-background/90 border border-border/60 hover:bg-destructive hover:text-destructive-foreground text-destructive shadow-2xs"
            onClick={() => console.log("Delete clicked")}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Cupping Score Floating */}
        {mockProduct.cupping_score && (
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-2xs">
            <Star className="w-3 h-3 fill-primary-foreground" />
            <span>{mockProduct.cupping_score} PTS</span>
          </div>
        )}
      </div>

      {/* 2. Nama Roastery, Produk, & Asal (Esensial) */}
      <CardHeader className="p-3 pb-1 space-y-0.5">
        <div className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-primary uppercase">
          <Coffee className="w-3 h-3 shrink-0" />
          <span className="truncate">{mockProduct.roastery.name}</span>
        </div>

        <h3 className="font-sans text-base font-bold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {mockProduct.product_name}
        </h3>

        {mockProduct.country_of_origin && (
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground pt-0.5">
            <Globe className="w-3 h-3 text-muted-foreground/70 shrink-0" />
            <span>{mockProduct.country_of_origin}</span>
          </div>
        )}
      </CardHeader>

      {/* 3. Atribut Kopi Utama (Process, Roast, Tasting Notes) */}
      <CardContent className="p-3 pt-1 space-y-2">
        <div className="flex flex-wrap gap-1 items-center">
          {mockProduct.processing && (
            <Badge
              variant="secondary"
              className="bg-accent text-accent-foreground border border-border/50 text-[10px] font-medium px-2 py-0.5"
            >
              <Sparkles className="w-2.5 h-2.5 mr-1 text-primary" />
              {mockProduct.processing}
            </Badge>
          )}

          {mockProduct.roast_level && (
            <div className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground px-2 py-0.5 rounded-md border border-border/40">
              <Flame className="w-3 h-3 text-primary shrink-0" />
              <span>{mockProduct.roast_level}</span>
            </div>
          )}
        </div>

        {/* Top 3 Tasting Notes */}
        <div className="flex flex-wrap gap-1">
          {flavourTags.map((note, index) => (
            <span
              key={index}
              className="text-[10px] font-medium bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-md border border-border/40"
            >
              {note}
            </span>
          ))}
        </div>
      </CardContent>

      {/* 4. Footer Harga & Tombol Aksi */}
      <CardFooter className="p-3 pt-2 border-t border-border/60 flex items-center justify-between bg-muted/10">
        <div>
          <span className="text-[10px] text-muted-foreground block leading-tight">
            {mockProduct.weight}g
          </span>
          <span className="text-sm font-bold text-foreground">
            Rp {mockProduct.price.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="flex gap-1.5">
          {mockProduct.product_url && (
            <Button
              size="sm"
              variant="ghost"
              className="gap-1 rounded-lg text-xs  h-7 px-2 border border-border/60 hover:bg-accent text-foreground"
              asChild
            >
              <a
                href={mockProduct.product_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Beli</span>
                <ArrowUpRightFromSquare className="w-3 h-3" />
              </a>
            </Button>
          )}

          <Button
            size="sm"
            variant="default"
            className="gap-1 cursor-pointer rounded-lg text-xs h-7 px-2.5"
            onClick={() => console.log("Detail clicked")}
          >
            <span>Detail</span>
            <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

