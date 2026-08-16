"use client";

import { useState } from "react";
import SearchAndFilterToolbar from "@/shared/components/SearchAndFilterToolbar";
import PouringMethodCard from "./PouringMethodCard";
import PouringMethodDetailModal from "./PouringMethodDetailModal";
import DeletePouringMethodDialog from "./DeletePouringMethodDialog";
import PouringMethodFormModal from "./PouringMethodFormModal";
import { useGetPouringMethods } from "../hooks/usePouringMethods";
import { usePouringMethodModal } from "../hooks/usePouringMethodModal";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, Workflow } from "lucide-react";

interface PouringMethodListProps {
  externalModal?: ReturnType<typeof usePouringMethodModal>;
}

export default function PouringMethodList({
  externalModal,
}: PouringMethodListProps) {
  const [search, setSearch] = useState("");

  const {
    data: methods = [],
    isLoading,
    isError,
    refetch,
  } = useGetPouringMethods({ search });

  const localModal = usePouringMethodModal();
  const modal = externalModal || localModal;

  return (
    <div className="space-y-6">
      {/* 1. Search Toolbar */}
      <SearchAndFilterToolbar
        searchPlaceholder="Cari nama metode penuangan atau deskripsi..."
        searchQuery={search}
        onSearchChange={setSearch}
      />

      {/* 2. Grid Container List */}
      {isLoading ? (
        // Loading Pulse Skeletons
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-64 w-full rounded-2xl bg-muted/40 animate-pulse border border-border/40"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-destructive/30 bg-destructive/5 space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-base font-bold text-foreground">
              Gagal Memuat Metode Penuangan
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Terjadi kesalahan saat mengambil data metode penuangan. Silakan coba lagi.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            className="h-8 text-xs rounded-xl font-semibold cursor-pointer px-4"
          >
            Coba Coba Lagi
          </Button>
        </div>
      ) : methods.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {methods.map((method) => (
            <PouringMethodCard
              key={method.id}
              method={method}
              onDetail={modal.openDetailModal}
              onEdit={modal.openEditModal}
              onDelete={modal.openDeleteDialog}
            />
          ))}
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-border bg-card/50 space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Workflow className="h-7 w-7" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h3 className="text-base font-bold text-foreground">
              {search ? "Metode Tidak Ditemukan" : "Belum Ada Metode Penuangan"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {search
                ? `Tidak ada metode penuangan yang cocok dengan kata kunci "${search}".`
                : "Buat metode penuangan custom kamu sendiri untuk seduhan kopi kamu."}
            </p>
          </div>

          {!search && (
            <Button
              size="sm"
              onClick={modal.openCreateModal}
              className="h-9 text-xs rounded-xl font-semibold cursor-pointer gap-1.5 px-4"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Metode Baru</span>
            </Button>
          )}
        </div>
      )}

      {/* 3. Modals & Dialog Overlays */}
      <PouringMethodFormModal
        isOpen={modal.isFormOpen}
        isEditMode={modal.isEditMode}
        initialData={modal.selectedMethod}
        onClose={modal.closeAllModals}
      />

      <PouringMethodDetailModal
        isOpen={modal.isDetailOpen}
        method={modal.selectedMethod}
        onClose={modal.closeAllModals}
      />

      <DeletePouringMethodDialog
        isOpen={modal.isDeleteOpen}
        method={modal.selectedMethod}
        onClose={modal.closeAllModals}
      />
    </div>
  );
}
