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
import { useRegister } from "../hooks/useRegister";
import { AUTH_ROUTES } from "../constants/auth.constants";

export default function RegisterForm() {
  const { errors, onSubmit, isSubmitting, register } = useRegister();

  const password = usePasswordToggle();
  const confirmPassword = usePasswordToggle();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Buat akun pertamamu</CardTitle>
        <CardDescription>Isi data pada form untuk membuat akun</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent>
          <div className="flex flex-col gap-3">
            {/* Pesan Error Utama Server */}
            {errors.root && (
              <div className="rounded-md bg-destructive/15 p-3 text-xs font-medium text-destructive text-center border border-destructive/20">
                {errors.root.message}
              </div>
            )}

            {/* Nama Lengkap */}
            <div className="grid gap-1.5">
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <Input
                id="full_name"
                type="text"
                placeholder="John Doe"
                {...register("full_name")}
              />
              {errors.full_name && (
                <p className="text-xs text-destructive">
                  {errors.full_name.message}
                </p>
              )}
            </div>

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

            {/* Username */}
            <div className="grid gap-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-xs text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-1.5">
              <Label htmlFor="password">Kata Sandi</Label>
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

            {/* Confirm Password */}
            <div className="grid gap-1.5">
              <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
              <div className="flex gap-2">
                <Input
                  id="confirmPassword"
                  type={confirmPassword.inputType}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                />
                <Button
                  type="button"
                  className="hover:cursor-pointer shrink-0"
                  variant="outline"
                  size="icon"
                  aria-label="Toggle confirm password visibility"
                  onClick={confirmPassword.toggleVisibility}
                >
                  {confirmPassword.isVisible ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
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
                Mendaftarkan...
              </>
            ) : (
              "Daftar Akun"
            )}
          </Button>
          <div className="flex items-center text-sm gap-1">
            <span className="text-muted-foreground">Sudah punya akun?</span>
            <Button
              asChild
              className="p-0 h-auto font-normal hover:cursor-pointer"
              variant="link"
            >
              <Link href={AUTH_ROUTES.LOGIN}>Masuk</Link>
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
