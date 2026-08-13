"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  ChevronRight,
  Globe,
  Mail,
  Pencil,
  Star,
  Store,
  Trash2,
} from "lucide-react";
import { Roastery } from "../types/roastery.type";

interface RoasteryCardProps {
  roastery: Roastery;
  onEdit?: (roastery: Roastery) => void;
  onDelete?: (roastery: Roastery) => void;
  onDetail?: (roastery: Roastery) => void;
}

export default function RoasteryCard({
  roastery,
  onEdit,
  onDelete,
  onDetail,
}: RoasteryCardProps) {
  return (
    <Card className="group relative overflow-hidden border border-border bg-card hover:border-primary/50 transition-all duration-300 rounded-xl w-full shadow-2xs flex flex-col justify-between">
      {/* 1. Header & Action Buttons */}
      <CardHeader className="p-3 pb-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-primary min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Store className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-sans text-sm font-bold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {roastery.roastery_name}
              </h3>
              {roastery.country && (
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Globe className="w-3 h-3 text-muted-foreground/70 shrink-0" />
                  <span className="truncate">{roastery.country}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 cursor-pointer rounded-lg border border-border/60 hover:bg-accent text-foreground shadow-2xs"
              onClick={() => onEdit?.(roastery)}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 cursor-pointer rounded-lg border border-border/60 hover:bg-destructive hover:text-destructive-foreground text-destructive shadow-2xs"
              onClick={() => onDelete?.(roastery)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* 2. Informasi Utama */}
      <CardContent className="p-3 pt-0 space-y-2 flex-1">
        {roastery.roastery_score ? (
          <div className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-md border border-primary/20">
            <Star className="w-3 h-3 fill-primary text-primary" />
            <span>Skor: {roastery.roastery_score} / 10</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-md border border-primary/20">
            <Star className="w-3 h-3 fill-primary text-primary" />
            <span>Skor: - / 10</span>
          </div>
        )}

        {roastery.contact_info ? (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
            <Mail className="w-3.5 h-3.5 shrink-0 text-muted-foreground/70" />
            <span className="truncate">{roastery.contact_info}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
            <Mail className="w-3.5 h-3.5 shrink-0 text-muted-foreground/70" />
            <span className="truncate">-</span>
          </div>
        )}
      </CardContent>

      {/* 3. Footer */}
      <CardFooter className="p-3 py-1.5 border-t border-border/60 flex items-end justify-end bg-muted/10">
        <Button
          size="sm"
          variant="ghost"
          className="gap-1 cursor-pointer rounded-lg text-xs h-7 px-2.5 hover:bg-accent"
          onClick={() => onDetail?.(roastery)}
        >
          <span>Detail</span>
          <ChevronRight className="w-3 h-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}
