"use client";

import { useEffect, useState } from "react";
import type { NavItem } from "@/lib/navigation";
import { Header } from "./header";
import { SubHeader } from "./sub-header";
import { TopNavigation } from "./top-navigation";

type SiteHeaderProps = {
  desktop: NavItem[];
  mobile: NavItem[];
  openingHours: string[];
  phoneNumber: string;
  phoneHref: string;
  bookingLabel: string;
  bookingHref: string;
  bookingOverlay: boolean;
};

export function SiteHeader({
  desktop,
  mobile,
  openingHours,
  phoneNumber,
  phoneHref,
  bookingLabel,
  bookingHref,
  bookingOverlay,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <header className="text-ink">
        <div className="bg-white px-gutter">
          <div className="mx-auto flex h-header max-w-column items-center justify-between">
            <Header open={open} onToggle={() => setOpen((value) => !value)} />
            <TopNavigation
              desktop={desktop}
              mobile={mobile}
              open={open}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      </header>
      <SubHeader
        lines={openingHours}
        phoneNumber={phoneNumber}
        phoneHref={phoneHref}
        bookingLabel={bookingLabel}
        bookingHref={bookingHref}
        bookingOverlay={bookingOverlay}
      />
    </>
  );
}
