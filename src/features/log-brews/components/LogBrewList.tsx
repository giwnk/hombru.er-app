"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Plus, Sparkles } from "lucide-react";
import SearchAndFilterToolbar from "@/shared/components/SearchAndFilterToolbar";
import { LogBrew, LogBrewParams } from "../types/log-brews.types";
import { useGetLogBrews } from "../hooks/useLogBrews";
import { LogBrewCard } from "./LogBrewCard";
import { LogBrewFormModal } from "./LogBrewFormModal";
import { LogBrewDetailModal } from "./LogBrewDetailModal";
import { DeleteLogBrewDialog } from "./DeleteLogBrewDialog";
import { BREW_METHODS } from "../constants/log-brews.constant";

export function LogBrewList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>("ALL");

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogBrew | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailLog, setDetailLog] = useState<LogBrew | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteLog, setDeleteLog] = useState<LogBrew | null>(null);

  // Build params query
  const queryParams: LogBrewParams = {
    search: searchQuery,
    method: selectedMethod !== "ALL" ? selectedMethod : undefined,
  };

  const { data: logs, isLoading, isError } = useGetLogBrews(queryParams);

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setSelectedLog(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (log: LogBrew) => {
    setIsEditMode(true);
    setSelectedLog(log);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (log: LogBrew) => {
    setDetailLog(log);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (log: LogBrew) => {
    setDeleteLog(log);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Jurnal Seduhan Kopi
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Catat resep, parameter rasio, suhu, hingga evaluasi profil rasa setiap seduhanmu.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          size="sm"
          className="h-10 text-xs font-semibold px-4 rounded-xl gap-2 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Seduhan Baru</span>
        </Button>
      </div>

      {/* 2. Toolbar & Filter */}
      <SearchAndFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari berdasarkan metode atau catatan seduh..."
        filters={
          <Select
            value={selectedMethod}
            onValueChange={setSelectedMethod}
          >
            <SelectTrigger className="w-[160px] h-9 text-xs rounded-xl bg-background border-border/70">
              <SelectValue placeholder="Semua Metode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Metode</SelectItem>
              {BREW_METHODS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {/* 3. Main Content View */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-5 border border-border/60 rounded-2xl space-y-3 bg-card"
            >
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-4 w-12 rounded-full" />
              </div>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 border border-destructive/20 bg-destructive/5 rounded-2xl space-y-2">
          <p className="text-xs font-semibold text-destructive">
            Gagal memuat catatan seduhan.
          </p>
          <p className="text-xs text-muted-foreground">
            Silakan periksa koneksi atau coba muat ulang halaman.
          </p>
        </div>
      ) : !logs || logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-border/80 rounded-2xl bg-card space-y-4">
          <div className="p-4 bg-primary/10 text-primary rounded-full">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="font-bold text-base text-foreground">
              Belum Ada Catatan Seduh
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mulai catat eksperimen seduhan pertamamu untuk melacak konsistensi rasa dan rasio terbaik!
            </p>
          </div>
          <Button
            onClick={handleOpenCreate}
            size="sm"
            className="h-9 text-xs font-semibold px-4 rounded-xl gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Catatan Seduh</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {logs.map((log) => (
            <LogBrewCard
              key={log.id}
              log={log}
              onViewDetail={handleOpenDetail}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      )}

      {/* Modals & Dialogs */}
      <LogBrewFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        isEditMode={isEditMode}
        initialData={selectedLog}
      />

      <LogBrewDetailModal
        isOpen={isDetailOpen}
        log={detailLog}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleOpenEdit}
      />

      <DeleteLogBrewDialog
        isOpen={isDeleteOpen}
        log={deleteLog}
        onClose={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
