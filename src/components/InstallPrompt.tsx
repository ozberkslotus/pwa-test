"use client";

import { Button, Drawer } from "antd";
import { Download, Share, SquarePlus, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  INSTALL_PROMPT_READY,
  installDismissal,
  isIos,
  isStandalone,
  type BeforeInstallPromptEvent,
} from "@/lib/pwa-install";

/** Popup, sayfa boyanıp oturduktan sonra açılsın */
const OPEN_DELAY_MS = 2000;

type Mode = "native" | "ios";

export function InstallPrompt() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("native");
  const [installing, setInstalling] = useState(false);
  const promptEvent = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Zaten ana ekrandan açılmışsa ya da yakın zamanda kapatıldıysa hiç gösterme
    if (isStandalone() || installDismissal.isActive()) return;

    let timer: ReturnType<typeof setTimeout>;
    const openLater = () => {
      timer = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    };

    // iOS'ta kurulum olayı hiç gelmez, doğrudan anlatımlı modu açıyoruz
    if (isIos()) {
      setMode("ios");
      openLater();
      return () => clearTimeout(timer);
    }

    const take = () => {
      const event = window.__installPromptEvent;
      if (!event) return false;
      promptEvent.current = event;
      setMode("native");
      openLater();
      return true;
    };

    // Olay <head>'deki script tarafından çoktan yakalanmış olabilir
    if (take()) return () => clearTimeout(timer);

    window.addEventListener(INSTALL_PROMPT_READY, take);
    return () => {
      window.removeEventListener(INSTALL_PROMPT_READY, take);
      clearTimeout(timer);
    };
  }, []);

  // Kurulum tamamlanınca popup'ı kapat ve erteleme kaydını temizle
  useEffect(() => {
    const onInstalled = () => {
      promptEvent.current = null;
      window.__installPromptEvent = null;
      installDismissal.clear();
      setOpen(false);
    };

    window.addEventListener("appinstalled", onInstalled);
    return () => window.removeEventListener("appinstalled", onInstalled);
  }, []);

  const handleInstall = useCallback(async () => {
    const event = promptEvent.current;
    if (!event) return;

    setInstalling(true);
    try {
      await event.prompt();
      const { outcome } = await event.userChoice;
      // Olay tek kullanımlık; tüketildikten sonra tekrar çağrılamaz
      promptEvent.current = null;
      window.__installPromptEvent = null;
      if (outcome === "dismissed") installDismissal.mark();
    } finally {
      setInstalling(false);
      setOpen(false);
    }
  }, []);

  const handleLater = useCallback(() => {
    installDismissal.mark();
    setOpen(false);
  }, []);

  return (
    <Drawer
      placement="bottom"
      open={open}
      onClose={handleLater}
      closable={false}
      styles={{ body: { padding: 0 } }}
    >
      <div className="flex flex-col gap-4 p-5 pb-safe-bottom">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-light">
            <Download className="h-5 w-5 text-brand" />
          </span>

          <div className="flex-1">
            <h2 className="text-base font-semibold text-ink">Uygulamayı yükleyin</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Ana ekrana ekleyin; tarayıcı adres çubuğu olmadan, tam ekran ve daha
              hızlı açılır.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLater}
            aria-label="Kapat"
            className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {mode === "ios" ? (
          // iOS'ta programatik kurulum yok; adımları göstermekle yetiniyoruz
          <>
            <ol className="m-0 flex list-none flex-col gap-2 p-0">
              <IosStep
                icon={<Share className="h-4 w-4 text-info" />}
                text="Alttaki Paylaş düğmesine dokunun"
              />
              <IosStep
                icon={<SquarePlus className="h-4 w-4 text-info" />}
                text="“Ana Ekrana Ekle”yi seçin"
              />
            </ol>
            <Button size="large" block onClick={handleLater}>
              Anladım
            </Button>
          </>
        ) : (
          <div className="flex gap-2">
            <Button size="large" className="flex-1" onClick={handleLater}>
              Daha sonra
            </Button>
            <Button
              type="primary"
              size="large"
              className="flex-1"
              loading={installing}
              onClick={handleInstall}
            >
              Yükle
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
}

function IosStep({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-3 rounded-xl bg-surface px-3 py-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white">
        {icon}
      </span>
      <span className="text-sm text-ink">{text}</span>
    </li>
  );
}
