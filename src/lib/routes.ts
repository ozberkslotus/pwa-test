// Uygulama sekmeleri — BottomNav, AppHeader ve giriş sonrası yönlendirme buradan okur.
// label: sekme altındaki kısa ad, title: üst bardaki tam ad.
export const APP_ROUTES = [
  { href: "/regional-performance", label: "Bölgesel", title: "Bölgesel Performans" },
  { href: "/outages", label: "Kesintiler", title: "Kesintiler" },
  { href: "/heatmap", label: "Yoğunluk", title: "Yoğunluk Haritası" },
  { href: "/feeders", label: "Fiderler", title: "Fiderler" },
] as const;

// Giriş yapıldıktan sonra açılan ekran
export const HOME_ROUTE = APP_ROUTES[0].href;

// /outages/123 gibi alt sayfalarda da ilgili sekmeyi bulur
export function matchRoute(pathname: string) {
  return APP_ROUTES.find(
    (r) => pathname === r.href || pathname.startsWith(`${r.href}/`),
  );
}
