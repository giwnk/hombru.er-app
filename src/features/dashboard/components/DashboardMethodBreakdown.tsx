"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Workflow } from "lucide-react";
import { MethodDistributionItem } from "../types/dashboard.type";

interface DashboardMethodBreakdownProps {
  methods: MethodDistributionItem[];
  totalBrews: number;
}

export function DashboardMethodBreakdown({
  methods,
  totalBrews,
}: DashboardMethodBreakdownProps) {
  return (
    <Card className="border border-border/70 shadow-2xs bg-card h-full flex flex-col justify-between">
      <CardContent className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-0.5 border-b border-border/40 pb-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Workflow className="w-4 h-4 text-primary" /> Distribusi Metode Seduh
          </h3>
          <p className="text-xs text-muted-foreground">
            Persentase perbandingan metode seduh yang paling sering kamu gunakan.
          </p>
        </div>

        {methods.length === 0 ? (
          <p className="text-xs text-muted-foreground py-6 text-center italic">
            Belum ada data metode seduh terdaftar.
          </p>
        ) : (
          <div className="space-y-3 py-1 flex-1">
            {methods.map((item) => (
              <div key={item.method} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-foreground">{item.method}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-normal text-[11px]">
                      {item.count} cangkir
                    </span>
                    <Badge variant="secondary" className="bg-primary/10 text-primary font-bold text-[10px] px-2 py-0">
                      {item.percentage}%
                    </Badge>
                  </div>
                </div>

                <div className="w-full bg-secondary/80 rounded-full h-2 overflow-hidden border border-border/40">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
