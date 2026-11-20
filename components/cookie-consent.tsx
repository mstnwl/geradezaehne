"use client";

import {
  Suspense,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  applyConsent,
  consentClientSnapshot,
  consentServerSnapshot,
  createConsent,
  injectGoogleTagManager,
  sameChoices,
  storeConsentForNextLoad,
  subscribeConsent,
  updateConsentMode,
  type ConsentChoice,
} from "@/lib/consent";
import { ClickIdPassthrough } from "@/components/click-id-passthrough";

const CookieConsentContext = createContext<(() => void) | null>(null);

const choiceButtonClass =
  "inline-flex h-11 w-full items-center justify-center rounded border border-ink bg-white px-3 text-center text-[0.8125rem] leading-none font-medium whitespace-nowrap text-ink hover:bg-background";

function CategoryControl({
  title,
  description,
  checked,
  locked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  locked?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  const labelId = useId();

  return (
    <div className="flex items-start justify-between gap-3 border-t border-beige py-2 first:border-t-0 first:pt-0">
      <div className="min-w-0">
        <p id={labelId} className="text-[0.8125rem] leading-snug font-medium">
          {title}
        </p>
        <p className="mt-0.5 text-[0.8125rem] leading-snug font-normal">{description}</p>
        {locked ? <p className="mt-0.5 text-[0.8125rem] leading-snug font-normal">Immer aktiv</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        disabled={locked}
        className={`relative h-7 w-12 shrink-0 rounded-full border border-ink ${checked ? "bg-accent" : "bg-beige"} ${locked ? "cursor-default" : ""}`}
        onClick={locked ? undefined : () => onChange?.(!checked)}
      >
        <span
          aria-hidden="true"
          className={`absolute top-1/2 size-5 -translate-y-1/2 rounded-full border border-ink bg-white ${checked ? "right-0.5" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

function CookieBanner({
  stored,
  settings,
  statistics,
  marketing,
  onStatistics,
  onMarketing,
  onAcceptAll,
  onRejectAll,
  onSave,
  onOpenSettings,
  onBack,
  onClose,
}: {
  stored: ConsentChoice | null;
  settings: boolean;
  statistics: boolean;
  marketing: boolean;
  onStatistics: (checked: boolean) => void;
  onMarketing: (checked: boolean) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onSave: () => void;
  onOpenSettings: () => void;
  onBack: () => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onEscape = useEffectEvent(() => {
    if (stored) {
      onClose();
    }
  });

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) {
      return;
    }

    panel.focus();

    const syncPadding = () => {
      document.body.style.paddingBottom = `${panel.offsetHeight}px`;
    };
    syncPadding();
    const observer = new ResizeObserver(syncPadding);
    observer.observe(panel);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onEscape();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      observer.disconnect();
      document.body.style.paddingBottom = "";
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return createPortal(
    <div className="fixed inset-x-0 bottom-0 z-30 flex max-h-[100dvh] flex-col justify-end">
      <div
        ref={panelRef}
        id="cookie-banner"
        role="dialog"
        aria-modal="false"
        aria-labelledby="cookie-banner-title"
        tabIndex={-1}
        style={{ outline: "none" }}
        className="max-h-[100dvh] overflow-y-auto bg-white text-ink"
      >
        <div className="mx-auto flex w-full max-w-column flex-col px-gutter pt-3">
          <div className="flex flex-col gap-1">
            <p id="cookie-banner-title" className="text-base leading-snug font-medium">
              {settings ? "Cookie- und Datenschutz-Einstellungen" : "Cookie-Zustimmung"}
            </p>
            {settings ? (
              <>
                <p className="max-w-3xl text-[0.8125rem] leading-snug font-medium">
                  Sie haben die Kontrolle über Ihre Daten
                </p>
                <p className="max-w-3xl text-[0.8125rem] leading-snug font-normal">
                  Erfahren Sie mehr über die von uns verwendeten Cookies und wählen Sie aus, welche Sie zulassen möchten.
                </p>
              </>
            ) : (
              <p className="max-w-3xl text-[0.8125rem] leading-snug font-normal">
                Wir verwenden Cookies und weitere Technologien, um Ihr Erlebnis auf dieser Website zu gestalten und,
                wenn Sie zustimmen, Besuche aus Werbung zuzuordnen. Optionale Cookies setzen wir nur mit Ihrer
                Zustimmung. Mehr Informationen finden Sie in unserer{" "}
                <Link href="/datenschutz" className="header-link underline underline-offset-4">
                  Datenschutzerklärung
                </Link>
                .
              </p>
            )}
          </div>
          {settings ? (
            <div className="mt-3 bg-background px-3 py-2">
              <CategoryControl
                title="Technisch notwendige Cookies"
                description="Diese Cookies sind erforderlich, damit die Website ordnungsgemäß funktioniert, zum Beispiel um Ihre Cookie-Auswahl zu speichern."
                checked
                locked
              />
              <CategoryControl
                title="Analysen"
                description="Diese Cookies helfen uns zu verstehen, wie die Website genutzt wird. Derzeit ist kein Analyse-Tool aktiv. Ein späteres Tool läuft nur mit Ihrer Zustimmung."
                checked={statistics}
                onChange={onStatistics}
              />
              <CategoryControl
                title="Marketing"
                description="Diese Cookies ordnen Besuche aus Werbung zu. Dazu gehören Google Tag Manager und Google Ads. Sie werden nur gesetzt, wenn Sie Marketing erlauben."
                checked={marketing}
                onChange={onMarketing}
              />
            </div>
          ) : null}
          <div className="sticky bottom-0 -mx-gutter flex flex-col items-start gap-2 bg-white px-gutter pt-3 pb-3">
            <div
              className={`grid w-full max-w-3xl grid-cols-1 gap-pair ${settings ? "sm:grid-cols-3" : "sm:max-w-xl sm:grid-cols-2"}`}
            >
              <button type="button" className={choiceButtonClass} onClick={onAcceptAll}>
                Alle akzeptieren
              </button>
              <button type="button" className={choiceButtonClass} onClick={onRejectAll}>
                Alle ablehnen
              </button>
              {settings ? (
                <button type="button" className={choiceButtonClass} onClick={onSave}>
                  Meine Auswahl speichern
                </button>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-gutter">
              {settings ? (
                <button type="button" className="header-link text-[0.8125rem] leading-snug" onClick={onBack}>
                  Zurück
                </button>
              ) : (
                <button type="button" className="header-link text-[0.8125rem] leading-snug" onClick={onOpenSettings}>
                  Einstellungen
                </button>
              )}
              {stored ? (
                <button type="button" className="header-link text-[0.8125rem] leading-snug" onClick={onClose}>
                  Schließen
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribeConsent, consentClientSnapshot, consentServerSnapshot);
  const stored = snapshot && snapshot !== "missing" ? snapshot : null;
  const [reopened, setReopened] = useState(false);
  const [settings, setSettings] = useState(false);
  const [statistics, setStatistics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const appliedDuringVisit = useRef(false);
  const open = snapshot === "missing" || reopened;

  useEffect(() => {
    if (appliedDuringVisit.current || !stored || (!stored.marketing && !stored.statistics)) {
      return;
    }

    updateConsentMode(stored);
    injectGoogleTagManager();
  }, [stored]);

  const close = useCallback(() => {
    setReopened(false);
    setSettings(false);
    returnFocus.current?.focus();
    returnFocus.current = null;
  }, []);

  const openSettings = useCallback(() => {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setStatistics(stored?.statistics ?? false);
    setMarketing(stored?.marketing ?? false);
    setSettings(false);
    setReopened(true);
  }, [stored]);

  const save = (next: ConsentChoice) => {
    if (stored && sameChoices(stored, next)) {
      close();
      return;
    }

    if (stored) {
      storeConsentForNextLoad(next, stored);
      return;
    }

    applyConsent(next);
    appliedDuringVisit.current = true;
    setReopened(false);
    setSettings(false);
  };

  return (
    <CookieConsentContext.Provider value={openSettings}>
      {children}
      <Suspense fallback={null}>
        <ClickIdPassthrough />
      </Suspense>
      {open ? (
        <CookieBanner
          stored={stored}
          settings={settings}
          statistics={statistics}
          marketing={marketing}
          onStatistics={setStatistics}
          onMarketing={setMarketing}
          onAcceptAll={() => save(createConsent(true, true))}
          onRejectAll={() => save(createConsent(false, false))}
          onSave={() => save(createConsent(statistics, marketing))}
          onOpenSettings={() => setSettings(true)}
          onBack={() => {
            setStatistics(stored?.statistics ?? false);
            setMarketing(stored?.marketing ?? false);
            setSettings(false);
          }}
          onClose={close}
        />
      ) : null}
    </CookieConsentContext.Provider>
  );
}

export function CookieSettingsButton() {
  const open = useContext(CookieConsentContext);

  return (
    <button
      type="button"
      className="header-link inline-flex w-fit items-center gap-pair text-nav"
      onClick={() => open?.()}
    >
      <span className="menu-arrow size-icon shrink-0" aria-hidden="true" />
      Cookie-Einstellungen
    </button>
  );
}
