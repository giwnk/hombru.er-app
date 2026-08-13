"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Mail, Star, Store, X } from "lucide-react";
import { Roastery } from "../types/roastery.type";

interface RoasteryDetailModalProps {
  roastery?: Roastery | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function RoasteryDetailModal({
  roastery,
  isOpen = true,
  onClose,
}: RoasteryDetailModalProps) {
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

  if (!isOpen || !roastery) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div className="relative w-full max-w-md flex flex-col bg-card border border-border rounded-2xl shadow-xl overflow-hidden p-6 space-y-4">
        {/* Close Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-sans text-lg font-bold text-foreground">
              {roastery.roastery_name}
            </h2>
            {roastery.country && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>{roastery.country}</span>
              </p>
            )}
          </div>
        </div>

        {roastery.roastery_score ? (
          <div className="flex items-center gap-2 bg-primary/10 p-3 rounded-xl border border-primary/20 text-xs">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="font-bold text-primary">
              Skor Roastery: {roastery.roastery_score} / 10
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-primary/10 p-3 rounded-xl border border-primary/20 text-xs">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="font-bold text-primary">
              Skor Roastery: - / 10
            </span>
          </div>
        )}

        {roastery.contact_info ? (
          <div className="space-y-1 text-xs">
            <span className="font-semibold text-muted-foreground block">
              Kontak / Alamat:
            </span>
            <div className="flex items-center gap-1.5 text-foreground bg-muted/30 p-2.5 rounded-lg border border-border/40">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{roastery.contact_info}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1 text-xs">
            <span className="font-semibold text-muted-foreground block">
              Kontak / Alamat:
            </span>
            <div className="flex items-center gap-1.5 text-foreground bg-muted/30 p-2.5 rounded-lg border border-border/40">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              <span>-</span>
            </div>
          </div>
        )}

        {roastery.more_info ? (
          <div className="space-y-1 text-xs">
            <span className="font-semibold text-muted-foreground block">
              Catatan Tambahan:
            </span>
            <p className="text-muted-foreground bg-muted/20 p-3 rounded-xl border border-border/40 leading-relaxed">
              {roastery.more_info}
            </p>
          </div>
        ) : (
          <div className="space-y-1 text-xs">
            <span className="font-semibold text-muted-foreground block">
              Catatan Tambahan:
            </span>
            <p className="text-muted-foreground bg-muted/20 p-3 rounded-xl border border-border/40 leading-relaxed">
              -
            </p>
          </div>
        )}

        <div className="pt-2 flex justify-start">
          <Button
            type="button"
            variant="outline"
            className="h-9 text-xs rounded-xl px-4 cursor-pointer"
            onClick={onClose}
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
