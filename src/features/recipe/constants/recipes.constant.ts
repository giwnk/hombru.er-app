export const RECIPE_MESSAGE = {
  SUCCESS: {
    CREATE_SUCCESS: "Resep seduh berhasil ditambahkan! ☕",
    UPDATE_SUCCESS: "Resep seduh berhasil diperbarui!",
    DELETE_SUCCESS: "Resep seduh berhasil dihapus!",
    FETCH_SUCCESS: "Daftar resep seduh berhasil dimuat.",
  },
  ERROR: {
    // Validasi Field Form
    NAME_REQUIRED: "Nama resep seduh wajib diisi.",
    NAME_MAX_LENGTH: "Nama resep maksimal 50 karakter.",
    METHOD_REQUIRED: "Silakan pilih metode seduh.",
    INGREDIENT_NAME_REQUIRED: "Nama bahan tidak boleh kosong.",
    INGREDIENT_AMOUNT_INVALID: "Jumlah bahan harus berupa angka lebih dari 0.",
    INGREDIENT_UNIT_REQUIRED: "Satuan bahan wajib dipilih.",

    // Validasi ID & Query Database
    INVALID_ID: "ID resep seduh tidak valid.",
    NOT_FOUND: "Resep seduh tidak ditemukan.",
    FETCH_FAILED: "Gagal memuat data resep seduh.",
    CREATE_FAILED: "Gagal menambahkan resep seduh baru.",
    UPDATE_FAILED: "Gagal memperbarui resep seduh.",
    DELETE_FAILED: "Gagal menghapus resep seduh.",

    // Auth & System Errors
    UNAUTHORIZED: "Kamu harus login terlebih dahulu.",
    SERVER_ERROR: "Terjadi kesalahan pada server. Silakan coba lagi.",
    UNKNOWN_ERROR:
      "Terjadi kesalahan tidak terduga. Silakan coba beberapa saat lagi.",
  },
} as const;

export const RECIPE_METHODS = [
  { value: "V60", label: "V60 / Pour Over" },
  { value: "Espresso", label: "Espresso Based" },
  { value: "Aeropress", label: "Aeropress" },
  { value: "French Press", label: "French Press" },
  { value: "Mokapot", label: "Mokapot" },
  { value: "Cold Brew", label: "Cold Brew / Immersion" },
  { value: "Mixology", label: "Mixology / Mocktail" },
  { value: "Lainnya", label: "Lainnya" },
] as const;

export const MEASUREMENT_UNITS = [
  { value: "g", label: "Gram (g)" },
  { value: "ml", label: "Mililiter (ml)" },
  { value: "oz", label: "Ounce (oz)" },
  { value: "pump", label: "Pump" },
  { value: "shot", label: "Shot" },
  { value: "pcs", label: "Pcs / Buah" },
  { value: "tsp", label: "Sendok Teh (tsp)" },
  { value: "tbsp", label: "Sendok Makan (tbsp)" },
  { value: "drop", label: "Tetes (drop)" },
  { value: "sec", label: "Detik (sec)" },
  { value: "°C", label: "Celcius (°C)" },
  { value: "clicks", label: "Clicks (Gilingan)" },
] as const;
