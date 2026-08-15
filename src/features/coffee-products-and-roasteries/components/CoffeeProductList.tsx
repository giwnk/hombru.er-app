"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Coffee, Plus, Search, SlidersHorizontal } from "lucide-react";
import SearchAndFilterToolbar from "@/shared/components/SearchAndFilterToolbar";
import CoffeeProductCard from "./CoffeeProductCard";
import { useGetCoffeeProducts } from "../hooks/useCoffeeProducts";
import { useCoffeeProductModal } from "../hooks/useCoffeeProductModal";
import CoffeeProductFormModal from "./CoffeeProductFormModal";
import DeleteCoffeeProductDialog from "./DeleteCoffeeProductDialog";
import CoffeeProductDetailModal from "./CoffeeProductDetailModal";

export default function CoffeeProductList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState("");
  const [roastLevel, setRoastLevel] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useGetCoffeeProducts({
    page: currentPage,
    search: search || undefined,
    processing: processing || undefined,
    roast_level: roastLevel || undefined,
  });

  const modal = useCoffeeProductModal();

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > 3) return;
    setCurrentPage(newPage);
    containerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div ref={containerRef} className="w-full space-y-6 scroll-mt-6">
      {/* 2. Reusable Shared Filter & Search Toolbar */}
      <SearchAndFilterToolbar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari nama kopi atau roaster..."
        filters={
          <>
            <Select
              value={processing || "all"}
              onValueChange={(val) => setProcessing(val === "all" ? "" : val)}
            >
              <SelectTrigger className="w-32 sm:w-36 h-9.5 text-xs rounded-xl bg-background border-border/70">
                <SelectValue placeholder="Semua Process" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Process</SelectItem>
                <SelectItem value="Washed">Washed</SelectItem>
                <SelectItem value="Natural">Natural</SelectItem>
                <SelectItem value="Honey">Honey</SelectItem>
                <SelectItem value="Anaerobic">Anaerobic</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={roastLevel || "all"}
              onValueChange={(val) => setRoastLevel(val === "all" ? "" : val)}
            >
              <SelectTrigger className="w-36 sm:w-40 h-9.5 text-xs rounded-xl bg-background border-border/70">
                <SelectValue placeholder="Semua Roast Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Roast Level</SelectItem>
                <SelectItem value="Light Roast">Light Roast</SelectItem>
                <SelectItem value="Medium-Light Roast">Medium-Light Roast</SelectItem>
                <SelectItem value="Medium Roast">Medium Roast</SelectItem>
                <SelectItem value="Medium-Dark Roast">Medium-Dark Roast</SelectItem>
                <SelectItem value="Dark Roast">Dark Roast</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />

      {/* 3. Grid List Coffee Cards / Loading / Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-64 w-full rounded-xl bg-muted/40 animate-pulse border border-border/40"
            />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/60 rounded-xl bg-muted/10 space-y-3">
          <Coffee className="w-10 h-10 text-muted-foreground/50 stroke-[1.25]" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              Belum Ada Produk Kopi
            </p>
            <p className="text-xs text-muted-foreground max-w-sm">
              Kamu belum memiliki koleksi kopi yang dicatat. Klik tombol Tambah Produk Kopi untuk memulai.
            </p>
          </div>
          <Button
            onClick={modal.openCreateModal}
            size="sm"
            className="gap-1.5 rounded-lg text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Produk Kopi</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((item) => (
            <CoffeeProductCard
              key={item.id}
              product={item}
              onDelete={modal.openDeleteDialog}
              onEdit={modal.openEditModal}
              onDetail={modal.openDetailModal}
            />
          ))}
        </div>
      )}

      <CoffeeProductFormModal
        isOpen={modal.isFormOpen}
        initialData={modal.selectedProduct}
        isEditMode={modal.isEditMode}
        onClose={modal.closeAllModals}
      />

      <CoffeeProductDetailModal
        isOpen={modal.isDetailOpen}
        product={modal.selectedProduct}
        onClose={modal.closeAllModals}
      />
      <DeleteCoffeeProductDialog
        isOpen={modal.isDeleteOpen}
        product={modal.selectedProduct}
        onClose={modal.closeAllModals}
      />

      {/* 4. Pagination Section */}
      <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>
          Menampilkan {data?.length || 0} produk kopi
        </span>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                text="Sebelumnya"
                className="cursor-pointer text-xs"
              />
            </PaginationItem>

            {[1, 2, 3].map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  onClick={() => handlePageChange(p)}
                  isActive={currentPage === p}
                  className="cursor-pointer text-xs"
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                text="Selanjutnya"
                className="cursor-pointer text-xs"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
