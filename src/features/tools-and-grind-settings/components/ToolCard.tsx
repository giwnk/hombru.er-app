"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Pencil, Sliders, Trash2, Wrench } from "lucide-react";
import { Tool } from "../types/tools.type";

interface ToolCardProps {
  tool: Tool;
  onEdit?: (tool: Tool) => void;
  onDelete?: (tool: Tool) => void;
  onCalibrate?: (tool: Tool) => void;
}

// Hardcoded Data bawaan jika props tidak dikirim


export default function ToolCard({
  tool,
  onEdit,
  onDelete,
  onCalibrate,
}: ToolCardProps) {
  const isGrinder = tool.tool_type === "grinder";

  return (
    <Card className="group relative overflow-hidden border border-border bg-card hover:border-primary/50 transition-all duration-300 rounded-xl w-full shadow-2xs flex flex-col justify-between">
      {/* 1. Header: Icon Tipe Alat & Action Buttons */}
      <CardHeader className="p-3.5 pb-2 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Box Ikon Alat */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Wrench className="h-4.5 w-4.5" />
            </div>

            <div className="min-w-0">
              {/* Badge Tipe Alat */}
              <Badge
                variant="secondary"
                className="capitalize text-[10px] font-semibold px-2 py-0.5 bg-accent text-accent-foreground border border-border/50"
              >
                {tool.tool_type}
              </Badge>

              {/* Nama Alat */}
              <h3 className="font-sans text-sm font-bold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors pt-0.5">
                {tool.tool_name}
              </h3>
            </div>
          </div>

          {/* Action Buttons (Edit & Delete) */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 cursor-pointer rounded-lg border border-border/60 hover:bg-accent text-foreground shadow-2xs"
              onClick={() => onEdit?.(tool)}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 cursor-pointer rounded-lg border border-border/60 hover:bg-destructive hover:text-destructive-foreground text-destructive shadow-2xs"
              onClick={() => onDelete?.(tool)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* 2. Content: Brand, Model & Notes */}
      <CardContent className="p-3.5 pt-0 space-y-2 flex-1">
        <div className="text-xs text-muted-foreground space-y-0.5">
          <p className="font-medium text-foreground/80">
            {tool.brand} {tool.model && `• ${tool.model}`}
          </p>
          {tool.notes ? (
            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed pt-1">
              {tool.notes}
            </p>
          ) : (
            <p className="text-[11px] text-muted-foreground/60 italic pt-1">
              Tidak ada catatan tambahan.
            </p>
          )}
        </div>
      </CardContent>

      {/* 3. Footer: Conditional Rendering Tombol Kalibrasi khusus Grinder */}
      <CardFooter className="p-3.5 py-2.5 border-t border-border/60 bg-muted/10">
        {isGrinder ? (
          <Button
            size="sm"
            variant="ghost"
            className="w-full gap-1.5 cursor-pointer rounded-lg text-xs h-8 font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
            onClick={() => onCalibrate?.(tool)}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Kalibrasi Gilingan</span>
          </Button>
        ) : (
          <span className="text-[10px] font-medium text-muted-foreground">
            Alat Seduh Kopi
          </span>
        )}
      </CardFooter>
    </Card>
  );
}