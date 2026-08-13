import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const updateSession = async (request: NextRequest) => {
  // 1. Setup response bawaan persis seperti kodemu
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Setup client persis seperti kodemu
  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // ==========================================
  // 🔥 3. BAGIAN KRUSIAL (Yang kurang dari kodemu)
  // ==========================================
  // Baris ini WAJIB ada! Ini yang menyuruh Supabase mengecek token.
  // Kalau tokennya mau expired, Supabase akan otomatis memperbarui cookies
  // menggunakan fungsi `setAll` yang udah kamu definisikan di atas.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ==========================================
  // 🔗 CATCH SUPABASE CONFIRMATION CODE
  // ==========================================
  // Jika Supabase meredirect link konfirmasi ke root URL (?code=...), alihkan ke /auth/callback
  if (
    request.nextUrl.searchParams.has("code") &&
    !request.nextUrl.pathname.startsWith("/auth/callback")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    return NextResponse.redirect(url);
  }

  // ==========================================
  // 🛡️ 4. LOGIC PROTEKSI ROUTE
  // ==========================================
  const pathname = request.nextUrl.pathname;

  // Amankan halaman yang membutuhkan autentikasi (/collections, /dashboard, atau root /)
  const isProtectedRoute =
    pathname === "/" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/collections");

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Alihkan user yang sudah login dari halaman auth / landing page ke /collections
  const isAuthOrLandingRoute =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register") ||
    pathname === "/";

  if (user && isAuthOrLandingRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/collections";
    return NextResponse.redirect(url);
  }

  // 5. Kembalikan response yang cookies-nya sudah aman
  return supabaseResponse;
};
