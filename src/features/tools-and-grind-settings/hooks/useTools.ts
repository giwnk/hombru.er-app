import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateToolPayload, ToolParams, UpdateToolPayload } from "../types/tools.type";
import { createTool, deleteTool, getToolById, getTools, updateTool } from "../services/tools.service";
import { toast } from "sonner";

export const useGetTools = (params?: ToolParams) => {
  return useQuery({
    queryKey: ["tools", params],
    queryFn: async () => {
      const res = await getTools(params);
      if (!res.success) {
        throw new Error(res.error || "Gagal mengambil alat seduh.");
      }
      return res.data || [];
    },
  });
};

export const useGetToolById = (id: string) => {
  return useQuery({
    queryKey: ["tool", id],
    queryFn: async () => {
      const res = await getToolById(id);
      if (!res.success) {
        throw new Error(res.error || "Gagal mengambil detail alat");
      }
      return res.data;
    },
    enabled: Boolean(id && id.trim() !== ""),
  });
};

export const useCreateTool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateToolPayload) => createTool(payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Alat seduh berhasil ditambahkan!");
        queryClient.invalidateQueries({ queryKey: ["tools"] });
        queryClient.invalidateQueries({ queryKey: ["tools_select"] });
        queryClient.invalidateQueries({ queryKey: ["log_brews"] });
      } else {
        toast.error(res.error || "Gagal menambahkan alat seduh.");
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useUpdateTool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateToolPayload) => updateTool(payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Alat seduh berhasil diperbarui!");
        queryClient.invalidateQueries({ queryKey: ["tools"] });
        queryClient.invalidateQueries({ queryKey: ["tools_select"] });
        queryClient.invalidateQueries({ queryKey: ["log_brews"] });
      } else {
        toast.error(res.error || "Gagal memperbarui alat seduh.");
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useDeleteTool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTool(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Alat seduh berhasil dihapus!");
        queryClient.invalidateQueries({ queryKey: ["tools"] });
        queryClient.invalidateQueries({ queryKey: ["tools_select"] });
        queryClient.invalidateQueries({ queryKey: ["log_brews"] });
      } else {
        toast.error(res.error || "Gagal menghapus alat seduh.");
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });
};
