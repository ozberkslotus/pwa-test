# Mobil PWA

Next.js 16 (App Router) · TypeScript · Tailwind CSS · Ant Design 6 · TanStack React Query 5

Sadece mobil için tasarlanmış, ana ekrana eklenebilen (PWA) bir uygulama iskeleti.

## Başlangıç

```bash
npm install
npm run dev          # http://localhost:3000
```

PWA özelliklerini (service worker, offline) denemek için production modunda çalıştır:

```bash
npm run build && npm start
```

> Service worker yalnızca HTTPS veya `localhost` üzerinde çalışır. Telefondan denemek için
> ngrok / Cloudflare Tunnel gibi bir araçla HTTPS adres alabilirsin.

## Klasör yapısı

```
src/
├─ app/
│  ├─ layout.tsx          # metadata, viewport, provider'lar
│  ├─ manifest.ts         # PWA manifest (/manifest.webmanifest)
│  ├─ globals.css
│  ├─ page.tsx            # / → /login yönlendirmesi
│  ├─ (auth)/             # girişsiz ekranlar — klasör adı URL'e girmez
│  │  └─ login/           # /login
│  └─ (app)/              # giriş gerektiren ekranlar
│     ├─ layout.tsx       # auth guard + AppHeader + BottomNav (tek yerde)
│     ├─ regional-performance/  # /regional-performance — Bölgesel Performans
│     ├─ outages/         # /outages — Kesintiler
│     ├─ heatmap/         # /heatmap — Yoğunluk Haritası
│     └─ feeders/         # /feeders — Fiderler
├─ components/
│  ├─ Providers.tsx       # React Query + Ant Design (tema, TR dil)
│  ├─ MobileShell.tsx     # telefon genişliğinde kapsayıcı + safe-area
│  ├─ AppHeader.tsx       # başlık + çıkış
│  ├─ BottomNav.tsx       # alt sekme çubuğu
│  └─ ServiceWorkerRegister.tsx
├─ features/
│  └─ auth/               # api, hook'lar, tipler (özellik bazlı klasörleme)
└─ lib/
   ├─ api.ts              # fetch sarmalayıcı (token, hata yönetimi)
   ├─ routes.ts           # sekme tanımları (BottomNav + AppHeader buradan okur)
   ├─ query-client.ts
   ├─ theme.ts            # Ant Design teması
   └─ token-storage.ts
public/
├─ sw.js                  # service worker
├─ offline.html
└─ icons/
```

## Yeni ekran ekleme

1. `src/lib/routes.ts` içindeki `APP_ROUTES`'a `{ href, label, title }` ekle.
2. `src/components/BottomNav.tsx` içindeki `ICONS` haritasına ikonu ekle.
3. `src/app/(app)/<href>/page.tsx` dosyasını oluştur.

Auth kontrolü ve alt menü `(app)/layout.tsx`'ten geldiği için sayfada tekrar yazılmaz.
Bir ekran başka bir ekranın detayıysa onun altına gir (`outages/[id]/page.tsx`), kardeşse
`(app)` altında ayrı klasör olsun.

## Notlar

- **Backend bağlantısı:** `.env.example` dosyasını `.env.local` olarak kopyala ve
  `NEXT_PUBLIC_API_URL` değerini gir. Bu değer yokken giriş sahte (mock) çalışır:
  geçerli bir e-posta ve en az 6 karakterli herhangi bir şifre kabul edilir.
- **Tailwind + Ant Design:** Tailwind'in `preflight` reset'i kapalı, böylece Ant Design
  stilleri bozulmaz. Renkler hem `tailwind.config.ts` hem `lib/theme.ts` içinde tanımlı,
  değiştirirken ikisini birlikte güncelle.
- **iOS yakınlaştırma:** Input font boyutu 16px tutuldu; daha küçük olursa iOS odaklanınca
  sayfayı yakınlaştırır.
- **Service worker:** Önbellek stratejisini değiştirdiğinde `public/sw.js` içindeki
  `VERSION` değerini artır.
- **İkonlar:** `public/icons` altındaki ikonlar yer tutucu, kendi logonla değiştir.
