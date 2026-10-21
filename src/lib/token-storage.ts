const KEY = "auth_token";

// Basit token saklama. Güvenlik gereksinimi yüksekse
// httpOnly cookie tabanlı bir yapıya geçilmesi önerilir.
export const tokenStorage = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(KEY);
    } catch {
      return null;
    }
  },
  set(token: string) {
    try {
      window.localStorage.setItem(KEY, token);
    } catch {
      /* gizli sekme vb. durumlarda sessizce geç */
    }
  },
  clear() {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* noop */
    }
  },
};
