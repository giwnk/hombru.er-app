export const GRIND_CATEGORIES = [
    "Super Fine",
    "Fine",
    "Fine to Medium",
    "Medium",
    "Medium to Coarse",
    "Coarse",
    "Super Coarse",
] as const

export type GrindCategory = (typeof GRIND_CATEGORIES)[number]

export const GRIND_SETTINGS_MESSAGE = {
  SUCCESS: {
    SAVE_SUCCESS: "Kalibrasi gilingan berhasil disimpan!",
    FETCH_SUCCESS: "Data kalibrasi gilingan berhasil dimuat.",
    RESET_SUCCESS: "Kalibrasi gilingan berhasil di-reset!",
  },
  ERROR: {
    // Form Validation (Zod)
    TOOL_ID_REQUIRED: "ID Grinder wajib ada untuk mengelola kalibrasi.",
    UNSELECTED_TOOL: "Pilih Grinder terlebih dahulu",
    CATEGORY_REQUIRED: "Kategori tingkat kehalusan wajib diisi.",
    MIN_VALUE_MAX_LENGTH: "Nilai awal kalibrasi maksimal 30 karakter.",
    MAX_VALUE_MAX_LENGTH: "Nilai akhir kalibrasi maksimal 30 karakter.",
    INVALID_RANGE: "Nilai awal tidak boleh lebih besar dari nilai akhir.",
    REQUIRED_SETTINGS: "Setidaknya isi 1 nilai kalibrasi (awal atau akhir).",

    // API & Database Error Messages (Edge Cases)
    FETCH_FAILED:
      "Gagal memuat data kalibrasi gilingan. Silakan coba lagi nanti.",
    SAVE_FAILED:
      "Gagal menyimpan kalibrasi gilingan. Silakan periksa koneksi kamu.",
    RESET_FAILED: "Gagal me-reset kalibrasi gilingan dari sistem.",
    NOT_FOUND: "Data kalibrasi gilingan yang dicari tidak ditemukan.",
    UNAUTHORIZED:
      "Kamu harus login terlebih dahulu untuk mengelola kalibrasi gilingan.",
    INVALID_TOOL_ID: "ID Grinder tidak valid.",
    SERVER_ERROR: "Terjadi kesalahan server. Silakan coba beberapa saat lagi.",
    UNKNOWN_ERROR:
      "Terjadi kesalahan tidak terduga. Silakan coba beberapa saat lagi.",
  },
} as const;
