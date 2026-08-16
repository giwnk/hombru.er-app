import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCoffeeProduct,
  deleteCoffeeProduct,
  getCoffeeProducts,
  getCoffeeProductsById,
  getRoasteries,
  updateCoffeeProduct,
} from "../services/coffee-products.service";
import {
  CoffeeProductParams,
  CreateProductPayload,
  UpdateProductPayload,
} from "../types/coffee-products.type";

// ==========================================
// 1. Hook Fetching Daftar Produk Kopi (Read List)
// ==========================================
export const useGetCoffeeProducts = (params?: CoffeeProductParams) => {
  return useQuery({
    queryKey: ["coffee-products", params],
    queryFn: async () => {
      const response = await getCoffeeProducts(params);
      if (!response.success) {
        throw new Error(response.error || "Gagal mengambil data produk kopi.");
      }
      return response.data || [];
    },
  });
};

export const useGetRoasteries = () => {
  return useQuery({
    queryKey: ["roasteries"],
    queryFn: async () => {
      const response = await getRoasteries();
      if (!response.success) {
        throw new Error(response.error || "Gagal mengambil data roastery.");
      }
      return response.data || [];
    },
  });
};

// ==========================================
// 2. Hook Fetching Detail 1 Produk Kopi (Read Detail)
// ==========================================
export const useGetCoffeeProductById = (id: string) => {
  return useQuery({
    queryKey: ["coffee-product", id],
    queryFn: async () => {
      const response = await getCoffeeProductsById(id);
      if (!response.success) {
        throw new Error(
          response.error || "Gagal mengambil detail produk kopi.",
        );
      }
      return response.data;
    },
    enabled: Boolean(id && id.trim() !== ""),
  });
};

// ==========================================
// 3. Hook Tambah Produk Kopi (Create)
// ==========================================
export const useCreateCoffeeProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createCoffeeProduct(payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Produk kopi berhasil ditambahkan! ☕");
        queryClient.invalidateQueries({ queryKey: ["coffee-products"] });
        queryClient.invalidateQueries({ queryKey: ["coffee_products_select"] });
        queryClient.invalidateQueries({ queryKey: ["log_brews"] });
      } else {
        toast.error(res.error || "Gagal menambahkan produk kopi.");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || "Terjadi gangguan koneksi server.");
    },
  });
};

// ==========================================
// 4. Hook Update Produk Kopi (Update)
// ==========================================
export const useUpdateCoffeeProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProductPayload) => updateCoffeeProduct(payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Data produk kopi berhasil diperbarui.");
        queryClient.invalidateQueries({ queryKey: ["coffee-products"] });
        queryClient.invalidateQueries({ queryKey: ["coffee_products_select"] });
        queryClient.invalidateQueries({ queryKey: ["log_brews"] });
        if (res.data?.id) {
          queryClient.invalidateQueries({
            queryKey: ["coffee-product", res.data.id],
          });
        }
      } else {
        toast.error(res.error || "Gagal memperbarui produk kopi.");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || "Terjadi gangguan koneksi server.");
    },
  });
};

// ==========================================
// 5. Hook Hapus Produk Kopi (Delete)
// ==========================================
export const useDeleteCoffeeProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCoffeeProduct(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Produk kopi berhasil dihapus.");
        queryClient.invalidateQueries({ queryKey: ["coffee-products"] });
        queryClient.invalidateQueries({ queryKey: ["coffee_products_select"] });
        queryClient.invalidateQueries({ queryKey: ["log_brews"] });
      } else {
        toast.error(res.error || "Gagal menghapus produk kopi.");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || "Terjadi gangguan koneksi server.");
    },
  });
};
