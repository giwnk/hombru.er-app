import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createRoastery,
  deleteRoastery,
  getRoasteries,
  updateRoastery,
} from "../services/roastery.service";
import {
  CreateRoasteryPayload,
  RoasteryParams,
  UpdateRoasteryPayload,
} from "../types/roastery.type";

export const useGetRoasteries = (params?: RoasteryParams) => {
  return useQuery({
    queryKey: ["roasteries", params],
    queryFn: async () => {
      const res = await getRoasteries(params);
      if (!res.success) {
        throw new Error(res.error || "Gagal mengambil data roastery.");
      }
      return res.data || [];
    },
  });
};

export const useCreateRoastery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRoasteryPayload) => createRoastery(payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Roastery berhasil ditambahkan! 🏬");
        queryClient.invalidateQueries({ queryKey: ["roasteries"] });
      } else {
        toast.error(res.error || "Gagal menambahkan roastery.");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || "Terjadi kesalahan server.");
    },
  });
};

export const useUpdateRoastery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRoasteryPayload) => updateRoastery(payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Data roastery berhasil diperbarui.");
        queryClient.invalidateQueries({ queryKey: ["roasteries"] });
      } else {
        toast.error(res.error || "Gagal memperbarui roastery.");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || "Terjadi kesalahan server.");
    },
  });
};

export const useDeleteRoastery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRoastery(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Roastery berhasil dihapus.");
        queryClient.invalidateQueries({ queryKey: ["roasteries"] });
      } else {
        toast.error(res.error || "Gagal menghapus roastery.");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || "Terjadi kesalahan server.");
    },
  });
};
