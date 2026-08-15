"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TOOL_TYPES } from "../constants/tools.constant";
import { ToolType } from "../types/tools.type";
import { useGetTools } from "../hooks/useTools";
import { useToolModal } from "../hooks/useToolModal";
import ToolCard from "./ToolCard";
import ToolFormModal from "./ToolFormModal";
import GrindSettingsSheet from "./GrindSettingsSheet";
import DeleteToolDialog from "./DeleteToolDialog";
import SearchAndFilterToolbar from "@/shared/components/SearchAndFilterToolbar";
import { Plus, Wrench } from "lucide-react";

export default function ToolList() {
  const [search, setSearch] = useState("");
  const [toolType, setToolType] = useState<string>("all");

  const modal = useToolModal();

  const { data: tools, isLoading } = useGetTools({
    search: search || undefined,
    tool_type: toolType === "all" ? undefined : (toolType as ToolType),
  });

  return (
    <div className="space-y-6">
      {/* 1. Reusable Shared Toolbar Header */}
      <SearchAndFilterToolbar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari nama alat seduh, brand, atau model..."
        filters={
          <Select value={toolType} onValueChange={setToolType}>
            <SelectTrigger className="w-36 sm:w-44 h-9.5 text-xs rounded-xl bg-background border-border/70">
              <SelectValue placeholder="Semua Tipe Alat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                Semua Tipe Alat
              </SelectItem>
              {TOOL_TYPES.map((type) => (
                <SelectItem
                  key={type.value}
                  value={type.value}
                  className="text-xs"
                >
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
        actions={
          <Button
            size="sm"
            onClick={modal.openCreateModal}
            className="h-9.5 text-xs font-semibold rounded-xl gap-1.5 px-4 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Alat</span>
          </Button>
        }
      />

      {/* 2. Loading State (Pulse Skeleton) */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-44 w-full rounded-2xl bg-muted/40 animate-pulse border border-border/40"
            />
          ))}
        </div>
      ) : !tools || tools.length === 0 ? (
        /* 3. Empty State (Tampilan saat data kosong) */
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-border/80 bg-card/40 space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wrench className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">
              Belum Ada Alat Seduh
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              Kamu belum menambahkan peralatan seduh atau grinder. Klik + Tambah Alat di atas untuk memulai.
            </p>
          </div>
          <Button
            size="sm"
            onClick={modal.openCreateModal}
            className="gap-1.5 rounded-xl text-xs font-semibold cursor-pointer h-9 px-4 mt-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Alat Seduh</span>
          </Button>
        </div>
      ) : (
        /* 4. Grid Cards Container */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onEdit={modal.openEditModal}
              onDelete={modal.openDeleteDialog}
              onCalibrate={modal.openCalibrationSheet}
            />
          ))}
        </div>
      )}

      {/* 5. Modals & Sheet Component Overlays */}
      <ToolFormModal
        isOpen={modal.isFormOpen}
        initialData={modal.selectedTool}
        isEditMode={modal.isEditMode}
        onClose={modal.closeAllModals}
      />

      <DeleteToolDialog
        isOpen={modal.isDeleteOpen}
        tool={modal.selectedTool}
        onClose={modal.closeAllModals}
      />

      <GrindSettingsSheet
        isOpen={modal.isCalibrationOpen}
        tool={modal.selectedTool}
        onClose={modal.closeAllModals}
      />
    </div>
  );
}