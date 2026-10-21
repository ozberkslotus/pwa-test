"use client";

import { LogoutOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { usePathname } from "next/navigation";
import { useLogout } from "@/features/auth/hooks";
import { matchRoute } from "@/lib/routes";

// Tüm uygulama ekranlarında ortak üst bar. Başlık aktif sekmeden gelir.
export function AppHeader() {
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <header className="flex items-center justify-between gap-4 px-5 pt-6 pb-4">
      <h1 className="min-w-0 truncate text-xl font-bold text-ink">
        {matchRoute(pathname)?.title}
      </h1>
      <Button
        type="text"
        icon={<LogoutOutlined />}
        onClick={logout}
        aria-label="Çıkış yap"
      />
    </header>
  );
}
