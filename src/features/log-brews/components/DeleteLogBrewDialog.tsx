"use client";

import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { LogBrew } from "../types/log-brews.types";
import { useDeleteLogBrew } from "../hooks/useLogBrews";

interface DeleteLogBrewDialogProps {
  isOpen: boolean;
  log: LogBrew | null;
  onClose: () => void;
}

export function DeleteLogBrewDialog({
  isOpen,
  log,
  onClose,
}: DeleteLogBrewDialogProps) {
  const deleteMutation = useDeleteLogBrew();

  if (!isOpen || !log) return null;

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(log.id);
    onClose();
  };

  const beanName = log.bean?.product_name || "Catatan seduh";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-6 space-y-4">
        <div className="flex items-center gap-3 text-destructive">
          <div className="p-2.5 bg-destructive/10 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">Hapus Log Seduh</h3>
            <p className="text-xs text-muted-foreground">
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Apakah Anda yakin ingin menghapus catatan seduh metode{" "}
          <strong className="text-foreground">{log.method}</strong> untuk biji kopi{" "}
          <strong className="text-foreground">{beanName}</strong>?
        </p>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 text-xs px-4 rounded-lg cursor-pointer"
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="h-9 text-xs px-4 rounded-lg font-semibold cursor-pointer"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              "Hapus Catatan"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
