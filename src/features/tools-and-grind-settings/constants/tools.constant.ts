export const TOOL_TYPES = [
  {
    value: "grinder",
    label: "Grinder",
  },
  {
    value: "kettle",
    label: "Kettle",
  },
  {
    value: "scale",
    label: "Scale",
  },
  {
    value: "dripper",
    label: "Dripper",
  },
  {
    value: "server",
    label: "Coffee Server",
  },
  {
    value: "filter",
    label: "Paper Filter",
  },
  {
    value: "frother",
    label: "Milk Frother",
  },
  {
    value: "milkjug",
    label: "Milk Jug",
  },
  {
    value: "frenchpress",
    label: "French Press",
  },
  {
    value: "cup",
    label: "Coffee Cup",
  },
] as const;

export const TOOL_TYPE_VALUES = [
  "grinder",
  "kettle",
  "scale",
  "dripper",
  "server",
  "filter",
  "frother",
  "milkjug",
  "frenchpress",
  "cup",
] as const;

export type ToolType = (typeof TOOL_TYPES)[number]["value"];

export const TOOL_MESSAGE = {
  SUCCESS: {
    CREATE_SUCCESS: "Alat seduh berhasil ditambahkan!",
    UPDATE_SUCCESS: "Informasi alat seduh berhasil diperbarui!",
    DELETE_SUCCESS: "Alat seduh berhasil dihapus!",
    FETCH_SUCCESS: "Daftar alat seduh berhasil dimuat.",
  },
  ERROR: {
    // Form Validation Error Messages (Zod)
    TOOL_TYPE_REQUIRED: "Pilih tipe alat seduh terlebih dahulu.",
    INVALID_TOOL_TYPE: "Tipe alat seduh yang dipilih tidak valid.",
    NAME_REQUIRED: "Nama alat seduh wajib diisi.",
    BRAND_REQUIRED: "Nama merek alat seduh wajib diisi.",
    BRAND_MIN_LENGTH: "Nama brand minimal terdiri dari 1 karakter.",
    BRAND_MAX_LENGTH: "Nama brand maksimal 50 karakter.",
    MODEL_MAX_LENGTH: "Nama seri / model maksimal 50 karakter.",
    NOTES_MAX_LENGTH: "Catatan tambahan maksimal 250 karakter.",

    // API & Database Error Messages (Edge Cases)
    FETCH_FAILED: "Gagal memuat daftar alat seduh. Silakan coba lagi nanti.",
    CREATE_FAILED:
      "Gagal menambahkan alat seduh baru. Silakan periksa koneksi kamu.",
    UPDATE_FAILED: "Gagal memperbarui informasi alat seduh.",
    DELETE_FAILED: "Gagal menghapus alat seduh dari sistem.",
    NOT_FOUND: "Data alat seduh yang dicari tidak ditemukan.",
    UNAUTHORIZED:
      "Kamu harus login terlebih dahulu untuk mengelola alat seduh.",
    INVALID_ID: "ID alat seduh tidak valid.",
    SERVER_ERROR: "Terjadi kesalahan server. Silakan coba beberapa saat lagi.",
    UNKNOWN_ERROR:
      "Terjadi kesalahan tidak terduga. Silakan coba beberapa saat lagi.",
  },
} as const;
