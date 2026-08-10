import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MailCheck } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <section className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
            <MailCheck className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Cek Email Kamu!</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Pendaftaran akun berhasil dilakukan. Kami telah mengirimkan link konfirmasi ke alamat email kamu.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Silakan buka inbox atau folder <strong>Spam</strong> email kamu dan klik tautan konfirmasi untuk mengaktifkan akun.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 pt-2">
          <Button asChild className="w-full">
            <Link href="/auth/login">Kembali ke Halaman Masuk</Link>
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
