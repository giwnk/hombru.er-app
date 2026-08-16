import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createLogBrew,
  deleteLogBrew,
  getCoffeeProductsForSelect,
  getGrindSettingsForCheatsheet,
  getLogBrewById,
  getLogBrews,
  getPouringMethodsForSelect,
  getToolsForSelect,
  updateLogBrew,
} from "../services/log-brews.service";
import {
  CreateLogBrewPayload,
  LogBrewParams,
  UpdateLogBrewPayload,
} from "../types/log-brews.types";

/**
 * Hook untuk mengambil daftar jurnal seduh
 */
export const useGetLogBrews = (params?: LogBrewParams) => {
  return useQuery({
    queryKey: ["log_brews", params],
    queryFn: async () => {
      const res = await getLogBrews(params);
      if (!res.success) {
        throw new Error(res.error || "Gagal memuat jurnal seduhan");
      }
      return res.data || [];
    },
  });
};

/**
 * Hook untuk mengambil detail 1 log seduh
 */
export const useGetLogBrewById = (id?: string | null) => {
  return useQuery({
    queryKey: ["log_brews", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await getLogBrewById(id);
      if (!res.success) {
        throw new Error(res.error || "Gagal mengambil detail log seduh");
      }
      return res.data;
    },
    enabled: Boolean(id),
  });
};

/**
 * Hook untuk mengambil daftar biji kopi pilihan (dropdown)
 */
export const useGetCoffeeProductsForSelect = () => {
  return useQuery({
    queryKey: ["coffee_products_select"],
    queryFn: async () => {
      const res = await getCoffeeProductsForSelect();
      if (!res.success) {
        throw new Error(res.error || "Gagal memuat daftar biji kopi");
      }
      return res.data || [];
    },
  });
};

/**
 * Hook untuk mengambil daftar alat kopi pilihan (multi-select)
 */
export const useGetToolsForSelect = () => {
  return useQuery({
    queryKey: ["tools_select"],
    queryFn: async () => {
      const res = await getToolsForSelect();
      if (!res.success) {
        throw new Error(res.error || "Gagal memuat daftar alat seduh");
      }
      return res.data || [];
    },
  });
};

/**
 * Hook untuk mengambil daftar metode penuangan (dropdown)
 */
export const useGetPouringMethodsForSelect = () => {
  return useQuery({
    queryKey: ["pouring_methods_select"],
    queryFn: async () => {
      const res = await getPouringMethodsForSelect();
      if (!res.success) {
        throw new Error(res.error || "Gagal memuat metode penuangan");
      }
      return res.data || [];
    },
  });
};

/**
 * Hook untuk mengambil kalibrasi gilingan untuk Cheatsheet berdasarkan tool_id
 */
export const useGetGrindSettingsForCheatsheet = (toolId?: string | null) => {
  return useQuery({
    queryKey: ["grind_settings_cheatsheet", toolId],
    queryFn: async () => {
      if (!toolId) return [];
      const res = await getGrindSettingsForCheatsheet(toolId);
      if (!res.success) {
        throw new Error(res.error || "Gagal memuat cheatsheet gilingan");
      }
      return res.data || [];
    },
    enabled: Boolean(toolId),
  });
};

/**
 * Hook Mutation Tambah Log Seduh
 */
export const useCreateLogBrew = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLogBrewPayload) => createLogBrew(payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Catatan seduh berhasil disimpan!");
        queryClient.invalidateQueries({ queryKey: ["log_brews"] });
      } else {
        toast.error(res.error || "Gagal menyimpan catatan seduh.");
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

/**
 * Hook Mutation Update Log Seduh
 */
export const useUpdateLogBrew = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateLogBrewPayload) => updateLogBrew(payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Catatan seduh berhasil diperbarui!");
        queryClient.invalidateQueries({ queryKey: ["log_brews"] });
      } else {
        toast.error(res.error || "Gagal memperbarui catatan seduh.");
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

/**
 * Hook Mutation Hapus Log Seduh
 */
export const useDeleteLogBrew = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLogBrew(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Catatan seduh berhasil dihapus!");
        queryClient.invalidateQueries({ queryKey: ["log_brews"] });
      } else {
        toast.error(res.error || "Gagal menghapus catatan seduh.");
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });
};
