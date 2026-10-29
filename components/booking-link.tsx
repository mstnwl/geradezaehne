"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

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

export function BookingLink({
  href,
  overlay = false,
  className,
  children,
}: {
  href: string;
  overlay?: boolean;
  className: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  if (!overlay) {
    if (/^(https?:|mailto:|tel:|#)/i.test(href)) {
      return (
        <a href={href} className={className}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <>
      <a
        href={href}
        className={className}
        onClick={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
      >
        {children}
      </a>
      {open ? <BookingOverlay href={href} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
