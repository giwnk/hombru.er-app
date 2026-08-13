export const ROASTERY_MESSAGES = {
  SUCCESS: {
    CREATE: "Roastery berhasil ditambahkan! 🏬",
    UPDATE: "Data roastery berhasil diperbarui.",
    DELETE: "Roastery berhasil dihapus.",
  },
  ERROR: {
    EMPTY_NAME: "Nama roastery wajib diisi.",
    INVALID_SCORE: "Skor roastery harus berupa angka antara 1 hingga 10.",
    SERVER_ERROR: "Terjadi kesalahan pada server. Silakan coba lagi.",
    NOT_FOUND: "Data roastery tidak ditemukan.",
  },
} as const;
