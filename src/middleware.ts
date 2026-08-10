import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Jalankan middleware pada semua path kecuali:
     * - _next/static (file statis)
     * - _next/image (file optimasi gambar)
     * - favicon.ico (file icon)
     * - file ekstensi gambar (png, jpg, svg, dll)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
