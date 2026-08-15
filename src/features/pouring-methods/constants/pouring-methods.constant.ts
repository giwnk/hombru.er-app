export const POURING_METHOD_MESSAGE = {
  SUCCESS: {
    CREATE_SUCCESS: "Metode penuangan berhasil ditambahkan!",
    UPDATE_SUCCESS: "Metode penuangan berhasil diperbarui!",
    DELETE_SUCCESS: "Metode penuangan berhasil dihapus!",
    FETCH_SUCCESS: "Daftar metode penuangan berhasil dimuat.",
  },
  ERROR: {
    NAME_REQUIRED: "Nama metode penuangan wajib diisi.",
    NAME_MAX_LENGTH: "Nama metode maksimal 50 karakter.",
    INTERVALS_REQUIRED: "Minimal tambahkan 1 tahapan penuangan (interval).",
    TARGET_WATER_REQUIRED: "Jumlah air penuangan harus lebih dari 0g.",
    INVALID_ID: "ID metode penuangan tidak valid.",
    FETCH_FAILED: "Gagal memuat data metode penuangan.",
    CREATE_FAILED: "Gagal menambahkan metode penuangan baru.",
    UPDATE_FAILED: "Gagal memperbarui metode penuangan.",
    DELETE_FAILED: "Gagal menghapus metode penuangan.",
    UNAUTHORIZED: "Kamu harus login terlebih dahulu.",
    SERVER_ERROR: "Terjadi kesalahan pada server. Silakan coba lagi.",
    NOT_FOUND: "Metode penuangan tidak ditemukan.",
    UNKNOWN_ERROR: "Terjadi kesalahan tidak terduga. Silakan coba beberapa saat lagi.",
  },
} as const;

// Preset Template Bawaan (Preset Hints)
export const DEFAULT_POURING_PRESETS = [
  {
    pour_name: "Metode 4:6 (Tetsu Kasuya)",
    description:
      "Membagi penuangan menjadi 40% (rasa manis & keasaman) dan 60% (kekuatan/kepekatan kopi).",
    intervals: [
      {
        step: 1,
        target_water: 60,
        duration_seconds: 45,
        notes: "Bloom (Ekstraksi awal & keasaman)",
      },
      {
        step: 2,
        target_water: 120,
        duration_seconds: 45,
        notes: "Penuangan ke-2 (Menyesuaikan manis)",
      },
      {
        step: 3,
        target_water: 180,
        duration_seconds: 45,
        notes: "Penuangan ke-3 (Strength)",
      },
      {
        step: 4,
        target_water: 240,
        duration_seconds: 45,
        notes: "Penuangan ke-4 (Strength)",
      },
      {
        step: 5,
        target_water: 300,
        duration_seconds: 45,
        notes: "Penuangan akhir",
      },
    ],
  },
  {
    pour_name: "Ultimate V60 (James Hoffmann)",
    description:
      "Teknik penuangan dengan perbandingan air 1:16.7 dan pengadukan bloom yang merata.",
    intervals: [
      {
        step: 1,
        target_water: 60,
        duration_seconds: 45,
        notes: "Bloom 2x berat kopi + aduk pelan",
      },
      {
        step: 2,
        target_water: 300,
        duration_seconds: 60,
        notes: "Penuangan kontinyu spiral hingga 60% berat air",
      },
      {
        step: 3,
        target_water: 500,
        duration_seconds: 45,
        notes: "Penuangan perlahan hingga 100% berat air",
      },
    ],
  },
] as const;
