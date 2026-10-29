"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BookingLink } from "@/components/booking-link";
import type { NavItem } from "@/lib/navigation";

type TopNavigationProps = {
  desktop: NavItem[];
  mobile: NavItem[];
  open: boolean;
  onClose: () => void;
};

function isCurrent(item: NavItem, pathname: string) {
  if (pathname === "/") {
    return item.href === "/" && item.name.startsWith("Startseite");
  }

  return item.href === pathname;
}

function NavLink({
  item,
  className,
  pathname,
  onClick,
  children,
}: {
  item: NavItem;
  className: string;
  pathname: string;
  onClick?: () => void;
  children?: ReactNode;
}) {
  const current = isCurrent(item, pathname) ? "page" : undefined;

  return (
    <BookingLink
      href={item.href}
      overlay={item.overlay === true}
      className={`header-link ${className}`}
      ariaCurrent={current}
      onClick={onClick}
    >
      {children}
      {item.name}
    </BookingLink>
  );
}

export function TopNavigation({
  desktop,
  mobile,
  open,
  onClose,
}: TopNavigationProps) {
  const pathname = usePathname();

  return (
    <>
      <nav
        className="enter enter-2 hidden items-center gap-nav lg:flex"
        aria-label="Hauptnavigation"
      >
        {desktop.map((item, index) => (
          <NavLink
            key={`${item.name}-${index}`}
            item={item}
            pathname={pathname}
            className="text-nav"
          />
        ))}
      </nav>
      {open ? (
        <div className="fixed inset-0 z-20 overflow-auto bg-white px-gutter lg:hidden">
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
            {mobile.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="enter"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <NavLink
                  item={item}
                  pathname={pathname}
                  className="inline-flex items-center gap-pair text-menu"
                  onClick={onClose}
                >
                  <span className="menu-arrow size-icon-lg shrink-0" aria-hidden="true" />
                </NavLink>
              </div>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  );
}
