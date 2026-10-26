"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const desktopLinks = [
  "Startseite",
  "Behandler & Team",
  "Praxis",
  "Behandlungsspektrum",
  "Fallbeispiele",
] as const;

const menuLinks = [
  "Startseite",
  "Behandler & Team",
  "Behandlungsspektrum",
  "Fallbeispiele",
  "Praxis",
  "Kontakt",
] as const;

type TopNavigationProps = {
  open: boolean;
  onClose: () => void;
};

export function TopNavigation({ open, onClose }: TopNavigationProps) {
  const pathname = usePathname();
  const homeCurrent = pathname === "/" ? "page" : undefined;

  return (
    <>
      <nav
        className="hidden items-center gap-nav lg:flex"
        aria-label="Hauptnavigation"
      >
        {desktopLinks.map((label) => (
          <Link
            key={label}
            href="/"
            className="text-nav"
            aria-current={label === "Startseite" ? homeCurrent : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
      {open ? (
        <div className="fixed inset-0 z-10 overflow-auto bg-white px-gutter lg:hidden">
          <div className="mx-auto flex h-header max-w-column items-center justify-end">
            <button type="button" aria-label="Menü schließen" onClick={onClose}>
              <Image
                src="/Icon32_BurgerX.svg"
                alt=""
                width={32}
                height={32}
                unoptimized
                className="size-icon-lg"
              />
            </button>
          </div>
          <nav
            aria-label="Menü"
            className="mx-auto flex max-w-column flex-col gap-menu"
          >
            {menuLinks.map((label) => (
              <Link
                key={label}
                href="/"
                className="inline-flex items-center gap-pair text-menu"
                aria-current={label === "Startseite" ? homeCurrent : undefined}
                onClick={onClose}
              >
                <Image
                  src="/Icon32_Arrow.svg"
                  alt=""
                  width={32}
                  height={32}
                  unoptimized
                  className="size-icon-lg"
                />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  );
}
