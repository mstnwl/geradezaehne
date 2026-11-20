"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  clickIdsFromSearch,
  hasClickIds,
  internalHrefWithClickIds,
  type ClickIds,
} from "@/lib/click-ids";

function mergeClickIds(current: ClickIds | null, search: string) {
  const found = clickIdsFromSearch(search);
  if (!hasClickIds(found)) {
    return current;
  }
  return { ...current, ...found };
}

export function ClickIdPassthrough() {
  const pathname = usePathname();
  const idsRef = useRef<ClickIds | null>(null);

  useEffect(() => {
    idsRef.current = mergeClickIds(idsRef.current, window.location.search);
    const ids = idsRef.current;
    if (!hasClickIds(ids)) {
      return;
    }

    const url = new URL(window.location.href);
    let changed = false;
    for (const [key, value] of Object.entries(ids)) {
      if (value && url.searchParams.get(key) !== value) {
        url.searchParams.set(key, value);
        changed = true;
      }
    }

    if (!changed) {
      return;
    }

    const next = `${url.pathname}${url.search}${url.hash}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (next !== current) {
      window.history.replaceState(window.history.state, "", next);
    }
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      idsRef.current = mergeClickIds(idsRef.current, window.location.search);
      const ids = idsRef.current;
      if (!hasClickIds(ids) || !(event.target instanceof Element)) {
        return;
      }

      const anchor = event.target.closest("a");
      if (!anchor || anchor.hasAttribute("data-booking-overlay") || anchor.hasAttribute("download")) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href) {
        return;
      }

      const decorated = internalHrefWithClickIds(href, window.location.href, ids);
      if (!decorated) {
        return;
      }

      const modified =
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0 ||
        anchor.target === "_blank";

      if (modified) {
        anchor.href = decorated;
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      window.location.assign(new URL(decorated, window.location.origin).href);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
