import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function ActivationSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-5">
      {/* Icon Centang (Bisa pakai Lucide Icons) */}
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl">
        <CheckCircle/>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">
          Akunmu Berhasil Diaktivasi
        </h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Email kamu udah terverifikasi. Sekarang kamu udah resmi jadi bagian
          dari komunitas Hombru.er. Siap buat nyeduh kopi pertamamu?
        </p>
      </div>

      <Button asChild className="mt-4">
        <Link href="/auth/login">Lanjut ke Halaman Login</Link>
      </Button>
    </div>
  );
}
