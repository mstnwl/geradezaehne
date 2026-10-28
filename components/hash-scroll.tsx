"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

function hashId() {
  const raw = window.location.hash.replace(/^#/, "");

  if (!raw) {
    return "";
  }

  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function findTarget(id: string) {
  const exact = document.getElementById(id);

  if (exact) {
    return exact;
  }

  const want = id.toLowerCase();

  for (const node of document.querySelectorAll<HTMLElement>("[id]")) {
    if (node.id.toLowerCase() === want) {
      return node;
    }
  }

  return null;
}

function scrollToTarget(id: string) {
  const target = findTarget(id);

  if (!target) {
    return false;
  }

  const rect = target.getBoundingClientRect();

  if (rect.width === 0 && rect.height === 0) {
    return false;
  }

  target.scrollIntoView({ block: "start" });

  return true;
}

export function HashScroll() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const id = hashId();

    if (!id) {
      return;
    }

    if (scrollToTarget(id)) {
      return;
    }

    const observer = new MutationObserver(() => {
      if (scrollToTarget(id)) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    const stop = window.setTimeout(() => observer.disconnect(), 8000);

    return () => {
      observer.disconnect();
      window.clearTimeout(stop);
    };
  }, [pathname]);

  useLayoutEffect(() => {
    const onHashChange = () => {
      const id = hashId();

      if (!id) {
        return;
      }

      scrollToTarget(id);
    };

    window.addEventListener("hashchange", onHashChange);

    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
