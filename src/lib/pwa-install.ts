// Ana ekrana ekleme (A2HS) akışının ortak parçaları.
//
// Chrome/Edge (Android, masaüstü) `beforeinstallprompt` olayını tetikler ve
// uygulamayı tek tıkla kurdurabiliriz. iOS Safari bu olayı hiç göndermez;
// orada kullanıcıya "Paylaş → Ana Ekrana Ekle" adımlarını anlatmaktan başka
// yol yok. Bu yüzden akış iki moda ayrılıyor: "native" ve "ios".

export type InstallOutcome = "accepted" | "dismissed";

export type BeforeInstallPromptEvent = Event & {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: InstallOutcome; platform: string }>;
  prompt(): Promise<void>;
};

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }

  interface Window {
    /** Erken yakalanan kurulum olayı (bkz. INSTALL_PROMPT_SNIPPET) */
    __installPromptEvent?: BeforeInstallPromptEvent | null;
  }
}

/** React hydrate olduğunda olayın yakalandığını haber veren özel olay adı */
export const INSTALL_PROMPT_READY = "installpromptready";

// `beforeinstallprompt` sayfa yüklenirken React hydrate olmadan önce
// tetiklenebiliyor; o anda dinleyici yoksa olay kaybolur ve kurulum
// düğmesi bir daha asla çalışmaz. Bu yüzden olayı <head> içindeki küçük
// bir script yakalayıp window üzerinde saklıyor, React sonradan okuyor.
export const INSTALL_PROMPT_SNIPPET = `
window.__installPromptEvent=null;
window.addEventListener("beforeinstallprompt",function(e){
  e.preventDefault();
  window.__installPromptEvent=e;
  window.dispatchEvent(new Event("${INSTALL_PROMPT_READY}"));
});
`.trim();

/** Uygulama zaten kurulu mu (ana ekrandan açılmış mı)? */
export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  // iOS Safari standart API'yi desteklemez, kendi bayrağını kullanır
  return (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

/** iOS/iPadOS mu? (iPadOS 13+ kendini Mac gibi tanıtır, dokunma sayısına bakıyoruz) */
export function isIos(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return true;
  return /macintosh/i.test(ua) && window.navigator.maxTouchPoints > 1;
}

const DISMISS_KEY = "pwa_install_dismissed_at";
/** "Daha sonra" denince popup'ın susacağı gün sayısı */
const DISMISS_DAYS = 7;

export const installDismissal = {
  /** Yakın zamanda kapatıldıysa popup'ı hiç açma */
  isActive(): boolean {
    if (typeof window === "undefined") return true;
    try {
      const raw = window.localStorage.getItem(DISMISS_KEY);
      if (!raw) return false;
      const elapsed = Date.now() - Number(raw);
      return elapsed < DISMISS_DAYS * 24 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  },
  mark() {
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* gizli sekme vb. durumlarda sessizce geç */
    }
  },
  clear() {
    try {
      window.localStorage.removeItem(DISMISS_KEY);
    } catch {
      /* noop */
    }
  },
};
