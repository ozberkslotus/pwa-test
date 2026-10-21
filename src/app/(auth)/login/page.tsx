import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import Image from "next/image";

export const metadata: Metadata = { title: "Giriş yap" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col px-6">
      <header className="pt-14 pb-10">
        <div className="mb-10 flex justify-center">
          <Image
            src="/icons/bg-blue-elips.svg" 
            alt="Giriş İllüstrasyonu"
            width={140}
            height={140}
            priority
          />
        </div>
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-ink">
          Tekrar hoş geldin
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          Devam etmek için hesabına giriş yap.
        </p>
      </header>

      <LoginForm />
    </main>
  );
}
