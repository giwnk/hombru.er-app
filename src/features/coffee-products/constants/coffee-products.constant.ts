export const CP_MESSAGES = {
  SUCCESS: {
    CREATE: "Produk kopi berhasil ditambahkan! ☕",
    UPDATE: "Data produk kopi berhasil diperbarui.",
    DELETE: "Produk kopi berhasil dihapus.",
  },
  ERROR: {
    EMPTY_PRODUCT_NAME: "Nama produk wajib diisi.",
    EMPTY_ROASTERY_NAME: "Nama roastery wajib diisi.",
    ROASTERY_UNSELECTED: "Silakan pilih atau tambah roastery.",
    INVALID_CUPPING_SCORE: "Cupping score harus berupa angka antara 75 hingga 100.",
    INVALID_ROASTERY_SCORE: "Roastery score harus berupa angka antara 1 hingga 10.",
    INVALID_WEIGHT: "Berat kopi harus berupa angka positif.",
    INVALID_ALTITUDE: "Ketinggian (altitude) harus berupa angka positif.",
    INVALID_PRICE: "Harga harus berupa angka positif.",
    INVALID_URL: "Format URL tidak valid.",
    SERVER_ERROR: "Terjadi kesalahan pada server. Silakan coba lagi.",
    NOT_FOUND: "Produk kopi tidak ditemukan.",
  },
} as const;

export const CP_ROUTES = {
  LIST: "/dashboard/coffee-products",
  CREATE: "/dashboard/coffee-products/new",
} as const;
