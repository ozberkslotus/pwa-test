// Tüm sayfaları telefon genişliğinde ortalar.
// Masaüstünde açılırsa da telefon görünümünü korur.
export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-surface">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-app flex-col bg-white pt-safe-top pb-safe-bottom shadow-[0_0_0_1px_rgba(24,32,29,0.06)]">
        {children}
      </div>
    </div>
  );
}
