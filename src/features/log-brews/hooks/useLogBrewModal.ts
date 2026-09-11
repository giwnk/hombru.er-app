import { useState } from "react";
import { LogBrew } from "../types/log-brews.types";

export function useLogBrewModal() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBrew, setSelectedBrew] = useState<LogBrew | null>(null);

  const openCreateModal = () => {
    setSelectedBrew(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const openEditModal = (brew: LogBrew) => {
    setSelectedBrew(brew);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const openDetailModal = (brew: LogBrew) => {
    setSelectedBrew(brew);
    setIsDetailOpen(true);
  };

  const openDeleteDialog = (brew: LogBrew) => {
    setSelectedBrew(brew);
    setIsDeleteOpen(true);
  };

  const closeAllModals = () => {
    setIsFormOpen(false);
    setIsDetailOpen(false);
    setIsDeleteOpen(false);
    setIsEditMode(false);
    setSelectedBrew(null);
  };

  return {
    isFormOpen,
    isDetailOpen,
    isDeleteOpen,
    isEditMode,
    selectedBrew,
    openCreateModal,
    openEditModal,
    openDetailModal,
    openDeleteDialog,
    closeAllModals,
  };
}
