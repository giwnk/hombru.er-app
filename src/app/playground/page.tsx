"use client";

import { Sparkles } from "lucide-react";
import ToolList from "@/features/tools-and-grind-settings/components/ToolList";

export default function PGPage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Playground Banner */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">
            Demo Showcase: Tools & Grind Settings UI
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Uji coba tampilan UI ToolList (Search Toolbar, Filter Tipe, Grid ToolCards, Modal Form, & Sheet Kalibrasi).
        </p>
      </div>

      {/* Main Feature Component Preview */}
      <ToolList />
    </main>
  );
}
