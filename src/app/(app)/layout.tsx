"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { tokenStorage } from "@/lib/token-storage";

// Giriş gerektiren tüm ekranların kabuğu.
// Guard burada tek yerde; alt sayfalar kendi kontrolünü yapmaz.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!tokenStorage.get()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  // Token kontrolü bitene kadar içerik çizilmez (korumalı veri sızmasın)
  if (!ready) return null;

  return (
    <>
      <AppHeader />
      {children}
      <BottomNav />
    </>
  );
}
