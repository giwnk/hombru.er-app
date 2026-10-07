import LoginForm from "@/features/auth/components/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <Image
        src="/Hombruer Icon.png"
        alt="Hombruer Icon"
        width={200}
        height={150}
        priority
      />
      <LoginForm />
    </section>
  );
}
