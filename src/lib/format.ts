// tr-TR biçimlendirme yardımcıları. Tarayıcıda çalıştırılır
// (sunucuda farklı sonuç verip hydration uyuşmazlığı yaratmasın diye
// yalnızca client bileşenlerinden çağır).
const numberFormat = new Intl.NumberFormat("tr-TR");
const timeFormat = new Intl.DateTimeFormat("tr-TR", {
  hour: "2-digit",
  minute: "2-digit",
});
const dateTimeFormat = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export const formatNumber = (n: number) => numberFormat.format(n);

export const formatTime = (iso: string) => timeFormat.format(new Date(iso));

export const formatDateTime = (iso: string) => dateTimeFormat.format(new Date(iso));

// 135 → "2sa 15dk", 240 → "4sa", 45 → "45dk"
export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m}dk`;
  return m ? `${h}sa ${m}dk` : `${h}sa`;
}

// Bugün ise saat, değilse gün + saat
export function formatMoment(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay ? formatTime(iso) : formatDateTime(iso);
}
