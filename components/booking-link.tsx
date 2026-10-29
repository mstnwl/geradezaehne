"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

const BookingOverlayContext = createContext<((href: string) => void) | null>(null);

function BookingOverlay({ href, onClose }: { href: string; onClose: () => void }) {
  const titleId = useId();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-gutter"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-[90vh] w-full max-w-column flex-col bg-white"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-bar shrink-0 items-center justify-between px-gutter">
          <p id={titleId} className="text-nav font-medium">
            Termin buchen
          </p>
          <button type="button" className="header-link text-nav" onClick={onClose}>
            Schließen
          </button>
        </div>
        <iframe src={href} title="Termin buchen" className="min-h-0 w-full flex-1" />
      </div>
    </div>,
    document.body,
  );
}

export function BookingOverlayProvider({ children }: { children: ReactNode }) {
  const [href, setHref] = useState<string | null>(null);
  const open = useCallback((next: string) => {
    setHref(next);
  }, []);
  const close = useCallback(() => {
    setHref(null);
  }, []);

  return (
    <BookingOverlayContext.Provider value={open}>
      {children}
      {href ? <BookingOverlay href={href} onClose={close} /> : null}
    </BookingOverlayContext.Provider>
  );
}

export function BookingLink({
  href,
  overlay = false,
  className,
  children,
  onClick,
  ariaCurrent,
}: {
  href: string;
  overlay?: boolean;
  className: string;
  children: ReactNode;
  onClick?: () => void;
  ariaCurrent?: "page";
}) {
  const openOverlay = useContext(BookingOverlayContext);
  const [open, setOpen] = useState(false);

  if (!overlay) {
    if (/^(https?:|mailto:|tel:|#)/i.test(href)) {
      return (
        <a href={href} className={className} aria-current={ariaCurrent} onClick={onClick}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={className} aria-current={ariaCurrent} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const show = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    openOverlay?.(href);
    if (!openOverlay) {
      setOpen(true);
    }
    onClick?.();
  };

  return (
    <>
      <a href={href} className={className} aria-current={ariaCurrent} onClick={show}>
        {children}
      </a>
      {!openOverlay && open ? <BookingOverlay href={href} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
