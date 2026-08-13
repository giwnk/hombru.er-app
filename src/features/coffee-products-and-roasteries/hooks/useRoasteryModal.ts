import { useState } from "react";
import { Roastery } from "../types/roastery.type";

export interface UseRoasteryModalReturn {
  isFormOpen: boolean;
  isEditMode: boolean;
  isDetailOpen: boolean;
  isDeleteOpen: boolean;
  selectedRoastery: Roastery | null;

  openCreateModal: () => void;
  openEditModal: (roastery: Roastery) => void;
  openDetailModal: (roastery: Roastery) => void;
  openDeleteDialog: (roastery: Roastery) => void;
  closeAllModals: () => void;
}

export const useRoasteryModal = (): UseRoasteryModalReturn => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRoastery, setSelectedRoastery] = useState<Roastery | null>(
    null
  );

  function openCreateModal() {
    setSelectedRoastery(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  }

  function openEditModal(roastery: Roastery) {
    setSelectedRoastery(roastery);
    setIsEditMode(true);
    setIsFormOpen(true);
  }

  function openDetailModal(roastery: Roastery) {
    setSelectedRoastery(roastery);
    setIsDetailOpen(true);
  }

  function openDeleteDialog(roastery: Roastery) {
    setSelectedRoastery(roastery);
    setIsDeleteOpen(true);
  }

  function closeAllModals() {
    setIsFormOpen(false);
    setIsEditMode(false);
    setIsDetailOpen(false);
    setIsDeleteOpen(false);
    setSelectedRoastery(null);
  }

  return {
    isFormOpen,
    isEditMode,
    isDetailOpen,
    isDeleteOpen,
    selectedRoastery,
    openCreateModal,
    openEditModal,
    openDetailModal,
    openDeleteDialog,
    closeAllModals,
  };
};
