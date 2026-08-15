import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getGrindSettingsByToolId,
  resetGrindSettings,
  saveGrindSettings,
} from "../services/grind-settings.service";
import { SaveGrindSettingsPayload } from "../types/grind-settings.types";
import { toast } from "sonner";

export const useGetGrindSettingsByToolId = (toolId: string) => {
  return useQuery({
    queryKey: ["grind_settings", toolId],
    queryFn: async () => {
      const res = await getGrindSettingsByToolId(toolId);
      if (!res.success) {
        throw new Error(res.error || "Gagal mengambil data kalibrasi grinder");
      }
      return res.data || [];
    },
    enabled: Boolean(toolId && toolId.trim() !== ""),
  });
};

export const useSaveGrindSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SaveGrindSettingsPayload) =>
      saveGrindSettings(payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(
          res.message || "Data kalibrasi grinder berhasil disimpan!",
        );
        queryClient.invalidateQueries({ queryKey: ["grind_settings"] });
      } else {
        toast.error(res.error || "Gagal menyimpan data kalibrasi grinder.");
      }
    },
    onError: (err: Error) => toast.error(err.message)
  });
};

export const useResetGrindSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      resetGrindSettings(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(
          res.message || "Data kalibrasi grinder berhasil direset!",
        );
        queryClient.invalidateQueries({ queryKey: ["grind_settings"] });
      } else {
        toast.error(res.error || "Gagal mereset data kalibrasi grinder.");
      }
    },
    onError: (err: Error) => toast.error(err.message)
  });
};
