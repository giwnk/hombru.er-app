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
import { Plus, Search, Store } from "lucide-react";
import { useGetRoasteries } from "../hooks/useRoasteries";
import { useRoasteryModal } from "../hooks/useRoasteryModal";
import RoasteryCard from "./RoasteryCard";
import RoasteryFormModal from "./RoasteryFormModal";
import RoasteryDetailModal from "./RoasteryDetailModal";
import DeleteRoasteryDialog from "./DeleteRoasteryDialog";

export default function RoasteryList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useGetRoasteries({
    search: search || undefined,
  });

  const modal = useRoasteryModal();

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setCurrentPage(newPage);
    containerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div ref={containerRef} className="w-full space-y-6 scroll-mt-6">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-muted/20 p-3 rounded-xl border border-border/60">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama roastery..."
            className="pl-9 text-xs h-9 rounded-lg bg-background border-border/60 focus-visible:ring-primary/40"
          />
        </div>
      </div>

      {/* Grid List Roasteries / Loading / Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-48 w-full rounded-xl bg-muted/40 animate-pulse border border-border/40"
            />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/60 rounded-xl bg-muted/10 space-y-3">
          <Store className="w-10 h-10 text-muted-foreground/50 stroke-[1.25]" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              Belum Ada Roastery
            </p>
            <p className="text-xs text-muted-foreground max-w-sm">
              Kamu belum mendaftarkan roastery partner. Klik tombol Tambah Roastery untuk memulai.
            </p>
          </div>
          <Button
            onClick={modal.openCreateModal}
            size="sm"
            className="gap-1.5 rounded-lg text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Roastery</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((item) => (
            <RoasteryCard
              key={item.id}
              roastery={item}
              onDelete={modal.openDeleteDialog}
              onEdit={modal.openEditModal}
              onDetail={modal.openDetailModal}
            />
          ))}
        </div>
      )}

      {/* Modals & Dialogs */}
      <RoasteryFormModal
        isOpen={modal.isFormOpen}
        initialData={modal.selectedRoastery}
        isEditMode={modal.isEditMode}
        onClose={modal.closeAllModals}
      />

      <RoasteryDetailModal
        isOpen={modal.isDetailOpen}
        roastery={modal.selectedRoastery}
        onClose={modal.closeAllModals}
      />

      <DeleteRoasteryDialog
        isOpen={modal.isDeleteOpen}
        roastery={modal.selectedRoastery}
        onClose={modal.closeAllModals}
      />

      {/* Pagination Section */}
      <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>Menampilkan {data?.length || 0} roastery</span>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                text="Sebelumnya"
                className="cursor-pointer text-xs"
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive className="cursor-pointer text-xs">
                1
              </PaginationLink>
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
