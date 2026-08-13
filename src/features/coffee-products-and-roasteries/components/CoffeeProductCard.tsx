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
  Calendar,
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
import { CoffeeProduct } from "../types/coffee-products.type";

interface CoffeeProductCardProps {
  product: CoffeeProduct;
  onEdit?: (product: CoffeeProduct) => void;
  onDelete?: (product: CoffeeProduct) => void;
  onDetail?: (product: CoffeeProduct) => void;
}

export default function CoffeeProductCard({
  product,
  onDetail,
  onEdit,
  onDelete,
}: CoffeeProductCardProps) {
  const dataProduct = product;

  // Ambil maksimal 3 tasting notes esensial
  const flavourTags = dataProduct.flavour_profile
    ?.split(",")
    .map((tag) => tag.trim())
    .slice(0, 3);

  return (
    <Card className="group relative overflow-hidden border border-border bg-card hover:border-primary/50 transition-all duration-300 rounded-xl w-full shadow-2xs">
      {/* 1. Gambar & Badge Esensial */}
      <div className="relative h-36 w-full overflow-hidden bg-muted">
        {dataProduct.product_image_url ? (
          <Image
            src={dataProduct.product_image_url}
            alt={dataProduct.product_name}
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
            onClick={() => onEdit?.(dataProduct)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 cursor-pointer rounded-lg bg-background/90 border border-border/60 hover:bg-destructive hover:text-destructive-foreground text-destructive shadow-2xs"
            onClick={() => onDelete?.(dataProduct)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Cupping Score Floating */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-2xs">
          <Star className="w-3 h-3 fill-primary-foreground" />
          <span>{dataProduct.cupping_score ? `${dataProduct.cupping_score} PTS` : "- PTS"}</span>
        </div>
      </div>

      {/* 2. Nama Roastery, Produk, & Asal (Esensial) */}
      <CardHeader className="p-3 pb-1 space-y-0.5">
        <div className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-primary uppercase">
          <Coffee className="w-3 h-3 shrink-0" />
          <span className="truncate">
            {dataProduct.roastery?.roastery_name ||
              dataProduct.roastery?.name ||
              dataProduct.roasteries?.roastery_name ||
              dataProduct.roasteries?.name ||
              "-"}
          </span>
        </div>

        <h3 className="font-sans text-base font-bold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {dataProduct.product_name || "-"}
        </h3>

        <div className="flex items-center gap-1 text-[11px] text-muted-foreground pt-0.5">
          <Globe className="w-3 h-3 text-muted-foreground/70 shrink-0" />
          <span>{dataProduct.country_of_origin || "-"}</span>
        </div>
      </CardHeader>

      {/* 3. Atribut Kopi Utama (Process, Roast, Tasting Notes) */}
      <CardContent className="p-3 pt-1 space-y-2">
        <div className="flex flex-wrap gap-1 items-center">
          <Badge
            variant="secondary"
            className="bg-accent text-accent-foreground border border-border/50 text-[10px] font-medium px-2 py-0.5"
          >
            <Sparkles className="w-2.5 h-2.5 mr-1 text-primary" />
            {dataProduct.processing ? dataProduct.processing : "Process: -"}
          </Badge>

          <div className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground px-2 py-0.5 rounded-md border border-border/40">
            <Flame className="w-3 h-3 text-primary shrink-0" />
            <span>{dataProduct.roast_level ? dataProduct.roast_level : "Roast Level: -"}</span>
          </div>

          <div className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground px-2 py-0.5 rounded-md border border-border/40">
            <Calendar className="w-3 h-3 text-primary shrink-0" />
            <span>{dataProduct.roast_date ? dataProduct.roast_date : "Roast Date: -"}</span>
          </div>
        </div>

        {/* Top 3 Tasting Notes */}
        <div className="flex flex-wrap gap-1">
          {flavourTags && flavourTags.length > 0 && flavourTags[0] !== "" ? (
            flavourTags.map((note, index) => (
              <span
                key={index}
                className="text-[10px] font-medium bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-md border border-border/40"
              >
                {note}
              </span>
            ))
          ) : (
            <span className="text-[10px] font-medium bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-md border border-border/40">
              Notes: -
            </span>
          )}
        </div>
      </CardContent>

      {/* 4. Footer Harga & Tombol Aksi */}
      <CardFooter className="p-3 pt-2 border-t border-border/60 flex items-center justify-between bg-muted/10">
        <div>
          <span className="text-[10px] text-muted-foreground block leading-tight">
            {dataProduct.weight ? `${dataProduct.weight}g` : "-g"}
          </span>
          <span className="text-sm font-bold text-foreground">
            {dataProduct.price ? `Rp ${dataProduct.price.toLocaleString("id-ID")}` : "Rp -"}
          </span>
        </div>

        <div className="flex gap-1.5">
          {dataProduct.product_url && (
            <Button
              size="sm"
              variant="ghost"
              className="gap-1 rounded-lg text-xs  h-7 px-2 border border-border/60 hover:bg-accent text-foreground"
              asChild
            >
              <a
                href={dataProduct.product_url}
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
            onClick={() => onDetail?.(dataProduct)}
          >
            <span>Detail</span>
            <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
