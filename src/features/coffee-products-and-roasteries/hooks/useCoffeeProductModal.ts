import { useState } from "react";
import { CoffeeProduct } from "../types/coffee-products.type";

export interface UseCoffeeProductModalReturn {
  // State Modal
  isFormOpen: boolean;
  isEditMode: boolean;
  isDetailOpen: boolean;
  isDeleteOpen: boolean;
  selectedProduct: CoffeeProduct | null;

  // Action Handler Methods
  openCreateModal: () => void;
  openEditModal: (product: CoffeeProduct) => void;
  openDetailModal: (product: CoffeeProduct) => void;
  openDeleteDialog: (product: CoffeeProduct) => void;
  closeAllModals: () => void;
}

export const useCoffeeProductModal = (): UseCoffeeProductModalReturn => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CoffeeProduct | null>(
    null
  );

  // 1. Membuka Form Modal dalam Mode Tambah (Create)
  function openCreateModal() {
    setSelectedProduct(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  }

  // 2. Membuka Form Modal dalam Mode Edit (Update)
  function openEditModal(product: CoffeeProduct) {
    setSelectedProduct(product);
    setIsEditMode(true);
    setIsFormOpen(true);
  }

  // 3. Membuka Modal Detail Produk
  function openDetailModal(product: CoffeeProduct) {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  }

  // 4. Membuka Dialog Konfirmasi Hapus
  function openDeleteDialog(product: CoffeeProduct) {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  }

  // 5. Menutup Semua Modal & Me-reset State Terpilih
  function closeAllModals() {
    setIsFormOpen(false);
    setIsEditMode(false);
    setIsDetailOpen(false);
    setIsDeleteOpen(false);
    setSelectedProduct(null);
  }

  return {
    isFormOpen,
    isEditMode,
    isDetailOpen,
    isDeleteOpen,
    selectedProduct,
    openCreateModal,
    openEditModal,
    openDetailModal,
    openDeleteDialog,
    closeAllModals,
  };
};
