import { useState } from "react";
import { Recipe } from "../types/recipes.type";

export function useRecipeModal() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const openCreateModal = () => {
    setSelectedRecipe(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const openEditModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const openDetailModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDetailOpen(true);
  };

  const openDeleteDialog = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDeleteOpen(true);
  };

  const closeAllModals = () => {
    setIsFormOpen(false);
    setIsDetailOpen(false);
    setIsDeleteOpen(false);
    setIsEditMode(false);
    setSelectedRecipe(null);
  };

  return {
    isFormOpen,
    isDetailOpen,
    isDeleteOpen,
    isEditMode,
    selectedRecipe,
    openCreateModal,
    openEditModal,
    openDetailModal,
    openDeleteDialog,
    closeAllModals,
  };
}
