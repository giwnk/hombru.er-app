export const AUTH_MESSAGES = {
  SUCCESS: {
    REGISTER: "Akun berhasil dibuat! Silakan cek email Anda.",
    LOGIN: "Berhasil masuk ke dalam akun! Selamat menyeduh ☕",
    LOGOUT: "Berhasil keluar dari akun.",
  },
  ERROR: {
    INVALID_PAYLOAD: "Data yang dikirim tidak valid. Periksa kembali form.",
    INVALID_CREDENTIALS: "Email atau kata sandi tidak sesuai.",
    EMAIL_UNCONFIRMED:
      "Email belum dikonfirmasi. Silakan cek inbox/spam email Anda untuk verifikasi.",
    USERNAME_TAKEN: "Username sudah digunakan. Silakan pilih username lain.",
    SERVER_ERROR: "Terjadi gangguan pada server. Silakan coba beberapa saat lagi.",
    NETWORK_ERROR: "Terjadi gangguan koneksi jaringan. Coba lagi sebentar ya.",
    LOGOUT_FAILED: "Gagal keluar dari sesi server.",
  },
} as const;

export const AUTH_ROUTES = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  VERIFY_EMAIL: "/auth/verify-email",
  ACTIVATION_SUCCESS: "/auth/activation-success",
  CALLBACK: "/auth/callback",
  DASHBOARD: "/dashboard",
  HOME: "/",
} as const;

export const AUTH_VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 20,
  MIN_FULLNAME_LENGTH: 3,
  MAX_FULLNAME_LENGTH: 250,
} as const;
