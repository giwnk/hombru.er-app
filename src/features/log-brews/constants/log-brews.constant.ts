export const LOG_BREWS_MESSAGE = {
  SUCCESS: {
    CREATE_SUCCESS: "Catatan seduh berhasil ditambahkan.",
    UPDATE_SUCCESS: "Catatan seduh berhasil diperbarui.",
    FETCH_SUCCESS: "Catatan seduh berhasil dimuat.",
    DELETE_SUCCESS: "Catatan seduh berhasil dihapus.",
  },
  ERROR: {
    CREATE_FAILED: "Gagal menambahkan catatan seduh.",
    UPDATE_FAILED: "Gagal memperbarui catatan seduh.",
    FETCH_FAILED: "Gagal memuat catatan seduh.",
    DELETE_FAILED: "Gagal menghapus catatan seduh.",

    // Auth & Permission Edge Cases
    UNAUTHORIZED: "Anda harus login terlebih dahulu.",
    NO_ACCESS: "Anda tidak memiliki izin untuk mengakses halaman ini.",

    // Validation Edge Cases
    INVALID_ID: "ID catatan seduh tidak valid.",
    BEAN_REQUIRED: "Silakan pilih biji kopi yang digunakan.",
    METHOD_REQUIRED: "Metode seduh wajib diisi.",
    COFFEE_WEIGHT_INVALID: "Dosis kopi harus lebih dari 0 gram.",
    WATER_WEIGHT_INVALID: "Jumlah air harus lebih dari 0 gram.",
    TEMPERATURE_INVALID: "Suhu air harus berada di antara 0°C hingga 100°C.",
    RATING_INVALID: "Rating harus berada di antara 1 hingga 5.",
    TDS_INVALID: "Nilai TDS harus berada di antara 0% hingga 30%.",
    EXTRACTION_TIME_INVALID: "Waktu ekstraksi harus bernilai positif.",

    // Network & Server Edge Cases
    NO_INTERNET: "Tidak ada koneksi internet. Periksa jaringan Anda.",
    TIMEOUT: "Permintaan memakan waktu terlalu lama. Coba lagi.",
    SERVER_ERROR: "Terjadi kesalahan pada server. Coba lagi nanti.",
    BAD_REQUEST: "Permintaan tidak valid.",
    NOT_FOUND: "Catatan seduh tidak ditemukan.",
    UNKNOWN_ERROR:
      "Terjadi kesalahan yang tidak diketahui. Coba beberapa saat lagi.",
  },
} as const;

export const BREW_METHODS = [
  { label: "V60", value: "V60" },
  { label: "French Press", value: "French Press" },
  { label: "Immersion Switch", value: "Immersion Switch" },
  { label: "Cold Brew", value: "Cold Brew" },
  { label: "AeroPress", value: "AeroPress" },
  { label: "Kalita Wave", value: "Kalita Wave" },
  { label: "Origami", value: "Origami" },
  { label: "Mokapot", value: "Mokapot" },
  { label: "Espresso", value: "Espresso" },
  { label: "Leverpresso", value: "Leverpresso" },
  { label: "Staresso", value: "Staresso" },
  { label: "Flair", value: "Flair" },
  { label: "Cold Drip", value: "Cold Drip" },
  { label: "Siphon", value: "Siphon" },
  { label: "Phin", value: "Phin" },
] as const;


