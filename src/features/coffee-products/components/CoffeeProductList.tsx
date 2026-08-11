"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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
import {
  Coffee,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import CoffeeProductCard from "./CoffeeProductCard";

export default function CoffeeProductList() {
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > 3) return;
    setCurrentPage(newPage);
    // Smooth scroll halus ke bagian atas daftar tanpa lompatan abrupt browser
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={containerRef} className="w-full space-y-6 scroll-mt-6">
      {/* 1. Header Section: Title & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-primary" />
            <h1 className="font-sans text-2xl font-bold text-foreground">
              Koleksi Kopi
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Kelola dan jelajahi berbagai produk kopi pilihan kamu.
          </p>
        </div>

        <Button className="gap-2 rounded-xl text-xs h-9 px-4 font-semibold shadow-2xs cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Kopi</span>
        </Button>
      </div>

      {/* 2. Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-muted/20 p-3 rounded-xl border border-border/60">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari nama kopi atau roaster..."
            className="pl-9 text-xs h-9 rounded-lg bg-background border-border/60 focus-visible:ring-primary/40"
          />
        </div>

        {/* Filter Badges / Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 pr-1 border-r border-border/60">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <Select>
            <SelectTrigger className="w-36 h-9 text-xs rounded-lg bg-background border-border/60">
              <SelectValue placeholder="Semua Process" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Process</SelectItem>
              <SelectItem value="washed">Washed</SelectItem>
              <SelectItem value="natural">Natural</SelectItem>
              <SelectItem value="honey">Honey</SelectItem>
              <SelectItem value="anaerobic">Anaerobic</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-40 h-9 text-xs rounded-lg bg-background border-border/60">
              <SelectValue placeholder="Semua Roast Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Roast Level</SelectItem>
              <SelectItem value="light">Light Roast</SelectItem>
              <SelectItem value="medium">Medium Roast</SelectItem>
              <SelectItem value="dark">Dark Roast</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="created_at">
            <SelectTrigger className="w-44 h-9 text-xs rounded-lg bg-background border-border/60">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Terbaru</SelectItem>
              <SelectItem value="cupping_score">Cupping Score Tertinggi</SelectItem>
              <SelectItem value="product_name">Nama A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 3. Grid List Coffee Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Render Card Referensi */}
        <CoffeeProductCard />
        <CoffeeProductCard />
        <CoffeeProductCard />
        <CoffeeProductCard />
      </div>

      {/* 4. Pagination Section */}
      <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>
          Menampilkan {(currentPage - 1) * 4 + 1} - {Math.min(currentPage * 4, 12)} dari 12 produk kopi
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
              <PaginationEllipsis />
            </PaginationItem>

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



