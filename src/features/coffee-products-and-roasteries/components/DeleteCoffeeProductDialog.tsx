"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { CoffeeProduct } from "../types/coffee-products.type";
import { useDeleteCoffeeProduct } from "../hooks/useCoffeeProducts";

interface DeleteCoffeeProductDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
  product?: CoffeeProduct | null;
}

export default function DeleteCoffeeProductDialog({
  isOpen = true,
  onClose,
  product,
}: DeleteCoffeeProductDialogProps) {
  // Lock body scroll saat dialog terbuka
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

  const deleteMutation = useDeleteCoffeeProduct();

  const handleDelete = async () => {
    if (!product?.id) return;
    try {
      await deleteMutation.mutateAsync(product.id);
      onClose?.();
    } catch (error) {
      console.error("Gagal menghapus produk kopi:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div className="relative w-full max-w-sm flex flex-col bg-card border border-border rounded-2xl shadow-xl overflow-hidden text-center p-6 space-y-4">
        {/* Close Icon Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 h-7 w-7 rounded-full hover:bg-muted text-muted-foreground cursor-pointer"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Warning Icon Banner */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="font-sans text-lg font-bold text-foreground">
            Hapus Produk Kopi?
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Apakah kamu yakin ingin menghapus{" "}
            <strong className="text-foreground">{product?.product_name}</strong>
            ? Action ini tidak dapat dibatalkan.
          </p>
        </div>

        {/* Footer Actions */}
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
