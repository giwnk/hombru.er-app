import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createRecipe,
  deleteRecipe,
  getLogBrewsForImport,
  getRecipeById,
  getRecipes,
  updateRecipe,
} from "../services/recipes.service";
import {
  CreateRecipePayload,
  RecipeParams,
  UpdateRecipePayload,
} from "../types/recipes.type";

export const useGetRecipes = (params?: RecipeParams) => {
  return useQuery({
    queryKey: ["recipes", params],
    queryFn: async () => {
      const res = await getRecipes(params);
      if (!res.success) {
        throw new Error(res.error || "Gagal memuat resep seduh");
      }
      return (
        res.data || {
          recipes: [],
          totalCount: 0,
          page: 1,
          limit: 6,
          totalPages: 1,
        }
      );
    },
  });
};

export const useGetRecipeById = (id?: string | null) => {
  return useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await getRecipeById(id);
      if (!res.success) {
        throw new Error(res.error || "Gagal mengambil detail resep");
      }
      return res.data;
    },
    enabled: Boolean(id),
  });
};

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRecipePayload) => createRecipe(payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Resep seduh berhasil dibuat! ☕");
        queryClient.invalidateQueries({ queryKey: ["recipes"] });
      } else {
        toast.error(res.error || "Gagal menambahkan resep seduh.");
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateRecipePayload) => updateRecipe(payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Resep seduh berhasil diperbarui!");
        queryClient.invalidateQueries({ queryKey: ["recipes"] });
        if (res.data?.id) {
          queryClient.invalidateQueries({ queryKey: ["recipe", res.data.id] });
        }
      } else {
        toast.error(res.error || "Gagal memperbarui resep seduh.");
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRecipe(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Resep seduh berhasil dihapus!");
        queryClient.invalidateQueries({ queryKey: ["recipes"] });
      } else {
        toast.error(res.error || "Gagal menghapus resep seduh.");
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useGetLogBrewsForImport = () => {
  return useQuery({
    queryKey: ["log_brews_import"],
    queryFn: async () => {
      const res = await getLogBrewsForImport();
      if (!res.success) {
        throw new Error(res.error || "Gagal memuat catatan seduh untuk import");
      }
      return res.data || [];
    },
  });
};
