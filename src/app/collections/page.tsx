"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coffee, Plus, Store } from "lucide-react";

// Coffee Product Components & Hooks
import CoffeeProductList from "@/features/coffee-products-and-roasteries/components/CoffeeProductList";
import CoffeeProductFormModal from "@/features/coffee-products-and-roasteries/components/CoffeeProductFormModal";
import { useCoffeeProductModal } from "@/features/coffee-products-and-roasteries/hooks/useCoffeeProductModal";

// Roastery Components & Hooks
import RoasteryList from "@/features/coffee-products-and-roasteries/components/RoasteryList";
import RoasteryFormModal from "@/features/coffee-products-and-roasteries/components/RoasteryFormModal";
import { useRoasteryModal } from "@/features/coffee-products-and-roasteries/hooks/useRoasteryModal";

export default function CollectionsPage() {
  const [activeTab, setActiveTab] = useState("coffee-products");

  // Modal Hooks
  const coffeeModal = useCoffeeProductModal();
  const roasteryModal = useRoasteryModal();

  return (
    <div className="w-full space-y-6">
      {/* 1. Header Section: Title & Top Right Dual CTA Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-primary shrink-0" />
            <h1 className="font-sans text-xl sm:text-2xl font-bold text-foreground">
              Koleksi Kopi & Roastery
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Kelola katalog biji kopi pilihan dan roastery favorit kamu di satu
            tempat.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
          {/* Secondary Button: Tambah Roastery */}
          <Button
            type="button"
            variant="outline"
            onClick={roasteryModal.openCreateModal}
            className="flex-1 sm:flex-none justify-center gap-1.5 sm:gap-2 rounded-xl text-xs h-9 px-3 sm:px-4 font-semibold shadow-2xs cursor-pointer border-border/70 hover:bg-accent"
          >
            <Store className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span>Tambah Roastery</span>
          </Button>

          {/* Primary Default Button: Tambah Biji Kopi */}
          <Button
            type="button"
            variant="default"
            onClick={coffeeModal.openCreateModal}
            className="flex-1 sm:flex-none justify-center gap-1.5 sm:gap-2 rounded-xl text-xs h-9 px-3 sm:px-4 font-semibold shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Tambah Biji Kopi</span>
          </Button>
        </div>
      </div>

      {/* 2. Dual Tabs View: Produk Kopi & Roastery */}
      <Tabs
        defaultValue="coffee-products"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-6"
      >
        <TabsList className="flex\w-full sm:w-80 gap-3 h-40 py-5 px-2 rounded-xl bg-muted/40 border border-border/60">
          <TabsTrigger
            value="coffee-products"
            className="gap-1.5 text-xs font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground shadow-2xs cursor-pointer h-8"
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Biji Kopi</span>
          </TabsTrigger>
          <TabsTrigger
            value="roasteries"
            className="gap-1.5 text-xs font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground shadow-2xs cursor-pointer h-8"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Roastery</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1 Content: Coffee Product List */}
        <TabsContent value="coffee-products" className="space-y-4 outline-none">
          <CoffeeProductList />
        </TabsContent>

        {/* Tab 2 Content: Roastery List */}
        <TabsContent value="roasteries" className="space-y-4 outline-none">
          <RoasteryList />
        </TabsContent>
      </Tabs>

      {/* Global Form Modals Triggered from Top Header */}
      <CoffeeProductFormModal
        isOpen={coffeeModal.isFormOpen}
        initialData={coffeeModal.selectedProduct}
        isEditMode={coffeeModal.isEditMode}
        onClose={coffeeModal.closeAllModals}
      />

      <RoasteryFormModal
        isOpen={roasteryModal.isFormOpen}
        initialData={roasteryModal.selectedRoastery}
        isEditMode={roasteryModal.isEditMode}
        onClose={roasteryModal.closeAllModals}
      />
    </div>
  );
}
