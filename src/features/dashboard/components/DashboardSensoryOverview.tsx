"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sliders } from "lucide-react";
import { SensoryAverages } from "../types/dashboard.type";

interface DashboardSensoryOverviewProps {
  sensory: SensoryAverages;
}

export function DashboardSensoryOverview({ sensory }: DashboardSensoryOverviewProps) {
  const items = [
    { label: "Sweetness (Manis)", value: sensory.sweetness },
    { label: "Acidity (Keasaman)", value: sensory.acidity },
    { label: "Body (Kepekatan)", value: sensory.body },
    { label: "Clarity (Kejelasan Rasa)", value: sensory.clarity },
    { label: "Bitterness (Kepahitan)", value: sensory.bitterness },
    { label: "Aftertaste (Finish)", value: sensory.aftertaste },
  ];

  return (
    <Card className="border border-border/70 shadow-2xs bg-card">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" /> Analisis Rata-Rata Profil Rasa
            </h3>
            <p className="text-xs text-muted-foreground">
              Karakter rasa rata-rata dari seluruh catatan seduhan kopi kamu.
            </p>
          </div>

          {sensory.profile_accuracy > 0 && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border border-primary/20 text-xs px-2.5 py-1 font-bold rounded-full shrink-0"
            >
              Akurasi Rasa: {sensory.profile_accuracy}/5
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {items.map((item) => (
            <div
              key={item.label}
              className="p-3 bg-muted/20 rounded-xl border border-border/40 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{item.label}</span>
                <span className="font-extrabold text-primary">{item.value} / 5</span>
              </div>

              {/* Visual Progress Bar */}
              <div className="w-full bg-secondary/80 rounded-full h-2 overflow-hidden border border-border/40">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(Math.min(item.value, 5) / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
