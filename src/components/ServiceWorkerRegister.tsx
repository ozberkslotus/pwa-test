"use client";

import { useEffect } from "react";

// Service worker yalnızca production'da kaydedilir.
// Geliştirme sırasında önbellek kafa karıştırmasın diye kapalı.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch((err) => console.error("Service worker kaydedilemedi:", err));
  }, []);

  return null;
}
