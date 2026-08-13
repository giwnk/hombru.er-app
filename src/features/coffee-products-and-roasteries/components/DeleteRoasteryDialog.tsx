"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { Roastery } from "../types/roastery.type";
import { useDeleteRoastery } from "../hooks/useRoasteries";

interface DeleteRoasteryDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
  roastery?: Roastery | null;
}

export default function DeleteRoasteryDialog({
  isOpen = true,
  onClose,
  roastery,
}: DeleteRoasteryDialogProps) {
  const deleteMutation = useDeleteRoastery();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !roastery) return null;

  const handleDelete = async () => {
    if (!roastery.id) return;
    try {
      await deleteMutation.mutateAsync(roastery.id);
      onClose?.();
    } catch (error) {
      console.error("Gagal menghapus roastery:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div className="relative w-full max-w-sm flex flex-col bg-card border border-border rounded-2xl shadow-xl p-6 text-center space-y-4">
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 h-7 w-7 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <div className="space-y-1.5">
          <h3 className="font-sans text-lg font-bold text-foreground">
            Hapus Roastery?
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Apakah kamu yakin ingin menghapus roastery{" "}
            <strong className="text-foreground">{roastery.roastery_name}</strong>? Action ini
            tidak dapat dibatalkan.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={deleteMutation.isPending}
            className="w-30 h-9 text-xs rounded-xl cursor-pointer"
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={deleteMutation.isPending}
            className="w-30 h-9 text-xs rounded-xl font-semibold cursor-pointer"
            onClick={handleDelete}
          >
            {deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus"}
          </Button>
        </div>
      </div>
    </div>
  );
}
