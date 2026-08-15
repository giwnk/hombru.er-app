import { useState } from "react";
import { Tool } from "../types/tools.type";

export function useToolModal() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);

  const openCreateModal = () => {
    setSelectedTool(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const openEditModal = (tool: Tool) => {
    setSelectedTool(tool);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (tool: Tool) => {
    setSelectedTool(tool);
    setIsDeleteOpen(true);
  };

  const openCalibrationSheet = (tool: Tool) => {
    setSelectedTool(tool);
    setIsCalibrationOpen(true);
  };

  const closeAllModals = () => {
    setIsFormOpen(false);
    setIsDeleteOpen(false);
    setIsCalibrationOpen(false);
    setSelectedTool(null);
  };

  return {
    selectedTool,
    isFormOpen,
    isEditMode,
    isDeleteOpen,
    isCalibrationOpen,
    openCreateModal,
    openEditModal,
    openDeleteDialog,
    openCalibrationSheet,
    closeAllModals,
  };
}
