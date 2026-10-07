"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePasswordToggle } from "../hooks/usePasswordToggle";
import { useLogin } from "../hooks/useLogin";
import { AUTH_ROUTES } from "../constants/auth.constants";

export default function LoginForm() {
  const { register, errors, onSubmit, isSubmitting } = useLogin();
  const password = usePasswordToggle();

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Masuk pada akun yang sudah dibuat</CardTitle>
        <CardDescription>
          Isi data pada form untuk masuk dan menggunakan akun
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent>
          <div className="flex flex-col gap-3 pb-4">
            {/* Pesan Error Utama (Server Error / Kredensial Salah) */}
            {errors.root && (
              <div className="rounded-md bg-destructive/15 p-3 text-xs font-medium text-destructive text-center border border-destructive/20">
                {errors.root.message}
              </div>
            )}

            {/* Email */}
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-1.5">
              <div className="flex items-center">
                <Label htmlFor="password">Kata Sandi</Label>
              </div>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type={password.inputType}
                  placeholder="••••••••"
                  {...register("password")}
                />
                <Button
                  type="button"
                  className="hover:cursor-pointer shrink-0"
                  variant="outline"
                  size="icon"
                  aria-label="Toggle password visibility"
                  onClick={password.toggleVisibility}
                >
                  {password.isVisible ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center gap-3 pt-3">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Masuk...
              </>
            ) : (
              "Masuk"
            )}
          </Button>
          <div className="flex items-center text-sm gap-1">
            <span className="text-muted-foreground">Belum punya akun?</span>
            <Button
              asChild
              className="p-0 h-auto font-normal hover:cursor-pointer"
              variant="link"
            >
              <Link href={AUTH_ROUTES.REGISTER}>Daftar</Link>
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
