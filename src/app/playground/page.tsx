"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CoffeeProductList from "@/features/coffee-products/components/CoffeeProductList";
import CoffeeProductFormModal from "@/features/coffee-products/components/CoffeeProductFormModal";
import CoffeeProductDetailModal from "@/features/coffee-products/components/CoffeeProductDetailModal";
import DeleteCoffeeProductDialog from "@/features/coffee-products/components/DeleteCoffeeProductDialog";
import { Eye, Edit3, Plus, Trash2, Sparkles } from "lucide-react";

export default function PGPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Playground Banner */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-bold tracking-tight">
                Demo Showcase: Coffee Products UI
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">
              Uji coba komponen UI (List, Card, Modal Form, Modal Detail, & Dialog Hapus).
            </p>
          </div>

          {/* Quick Demo Triggers */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs rounded-xl cursor-pointer"
              onClick={() => {
                setIsEditMode(false);
                setIsFormOpen(true);
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Modal Create</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs rounded-xl cursor-pointer"
              onClick={() => {
                setIsEditMode(true);
                setIsFormOpen(true);
              }}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Modal Edit</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs rounded-xl cursor-pointer"
              onClick={() => setIsDetailOpen(true)}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Modal Detail</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs rounded-xl cursor-pointer text-destructive border-destructive/40 hover:bg-destructive/10"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Dialog Hapus</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Feature Component Preview */}
      <CoffeeProductList />

      {/* Modals Demo Previews */}
      <CoffeeProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        isEditMode={isEditMode}
      />

      <CoffeeProductDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <DeleteCoffeeProductDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        productName="Ethiopia Guji Hambela"
      />
    </main>
  );
}