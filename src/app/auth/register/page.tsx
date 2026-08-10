import RegisterForm from "@/features/auth/components/RegisterForm";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <section className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center gap-6">
      <Image
        src="/Hombruer Icon.png"
        alt="Hombruer Icon"
        width={200}
        height={150}
        priority
      />
      <RegisterForm />
    </section>
  );
}
