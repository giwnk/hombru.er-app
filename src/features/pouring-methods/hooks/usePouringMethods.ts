import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPouringMethod,
  deletePouringMethod,
  getPouringMethodById,
  getPouringMethods,
  updatePouringMethod,
} from "../services/pouring-methods.service";
import {
  CreatePouringMethodPayload,
  PouringMethodParams,
  UpdatePouringMethodPayload,
} from "../types/pouring-methods.types";

export const useGetPouringMethods = (params?: PouringMethodParams) => {
  return useQuery({
    queryKey: ["pouring_methods", params],
    queryFn: async () => {
      const res = await getPouringMethods(params);
      if (!res.success) {
        throw new Error(res.error || "Gagal memuat metode penuangan");
      }
      return res.data || [];
    },
  });
};

export const useGetPouringMethodById = (id?: string | number | null) => {
  return useQuery({
    queryKey: ["pouring_methods", id],
    queryFn: async () => {
      if (id === undefined || id === null) return null;
      const res = await getPouringMethodById(id);
      if (!res.success) {
        throw new Error(res.error || "Gagal mengambil data metode penuangan");
      }
      return res.data;
    },
    enabled: id !== undefined && id !== null,
  });
};

export const useCreatePouringMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePouringMethodPayload) =>
      createPouringMethod(payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Metode penuangan berhasil dibuat!");
        queryClient.invalidateQueries({ queryKey: ["pouring_methods"] });
        queryClient.invalidateQueries({ queryKey: ["pouring_methods_select"] });
        queryClient.invalidateQueries({ queryKey: ["log_brews"] });
      } else {
        toast.error(res.error || "Gagal menambahkan metode penuangan.");
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useUpdatePouringMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePouringMethodPayload) =>
      updatePouringMethod(payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Metode penuangan berhasil diperbarui!");
        queryClient.invalidateQueries({ queryKey: ["pouring_methods"] });
        queryClient.invalidateQueries({ queryKey: ["pouring_methods_select"] });
        queryClient.invalidateQueries({ queryKey: ["log_brews"] });
      } else {
        toast.error(res.error || "Gagal memperbarui metode penuangan.");
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useDeletePouringMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => deletePouringMethod(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Metode penuangan berhasil dihapus!");
        queryClient.invalidateQueries({ queryKey: ["pouring_methods"] });
        queryClient.invalidateQueries({ queryKey: ["pouring_methods_select"] });
        queryClient.invalidateQueries({ queryKey: ["log_brews"] });
      } else {
        toast.error(res.error || "Gagal menghapus metode penuangan.");
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });
};
