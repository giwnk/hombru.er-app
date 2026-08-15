import { useState } from "react";
import { PouringMethod } from "../types/pouring-methods.types";

export function usePouringMethodModal() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PouringMethod | null>(
    null
  );

  const openCreateModal = () => {
    setSelectedMethod(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const openEditModal = (method: PouringMethod) => {
    setSelectedMethod(method);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (method: PouringMethod) => {
    setSelectedMethod(method);
    setIsDeleteOpen(true);
  };

  const openDetailModal = (method: PouringMethod) => {
    setSelectedMethod(method);
    setIsDetailOpen(true);
  };

  const closeAllModals = () => {
    setIsFormOpen(false);
    setIsDeleteOpen(false);
    setIsDetailOpen(false);
    setSelectedMethod(null);
  };

  return {
    isFormOpen,
    isEditMode,
    isDeleteOpen,
    isDetailOpen,
    selectedMethod,
    openCreateModal,
    openEditModal,
    openDeleteDialog,
    openDetailModal,
    closeAllModals,
  };
}
