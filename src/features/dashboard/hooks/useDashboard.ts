import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../services/dashboard.service";

export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard_stats"],
    queryFn: async () => {
      const res = await getDashboardStats();
      if (!res.success) {
        throw new Error(res.error || "Gagal memuat statistik dashboard");
      }
      return res.data;
    },
  });
};
