"use client";

import { useEffect } from "react";

type PendingScroll = {
  id: string;
  path: string;
};

function decodeHash(hash: string) {
  const raw = hash.replace(/^#/, "");

  if (!raw) {
    return "";
  }

  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }

  return path;
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

function barOffset() {
  const sticky = document.querySelector(".sticky.top-0");

  if (sticky instanceof HTMLElement) {
    const height = sticky.getBoundingClientRect().height;

    if (height > 0) {
      return height;
    }
  }

  const padding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);

  return Number.isFinite(padding) ? padding : 0;
}

// The reveal animation translates the section while it appears. Measure the
// layout position so that motion does not leave the heading under the bar.
function layoutTop(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const transform = getComputedStyle(element).transform;

  if (!transform || transform === "none") {
    return window.scrollY + rect.top;
  }

  return window.scrollY + rect.top - new DOMMatrix(transform).m42;
}

function hasSize(element: HTMLElement) {
  return element.offsetWidth > 0 || element.offsetHeight > 0;
}

export function HashScroll() {
  useEffect(() => {
    let pending: PendingScroll | null = null;
    let frame = 0;
    let started = 0;
    let stableSince = 0;
    let lastHeight = -1;
    let alignedOnce = false;
    const root = document.documentElement;
    const previousAnchor = root.style.overflowAnchor;

    const stop = () => {
      pending = null;
      stableSince = 0;
      lastHeight = -1;
      alignedOnce = false;
      window.cancelAnimationFrame(frame);
      root.style.overflowAnchor = previousAnchor;
    };

    const align = () => {
      if (!pending) {
        return false;
      }

      if (normalizePath(window.location.pathname) !== normalizePath(pending.path)) {
        return false;
      }

      const target = findTarget(pending.id);

      if (!target || !hasSize(target)) {
        return false;
      }

      const top = layoutTop(target) - barOffset();

      if (Math.abs(window.scrollY - top) > 1) {
        window.scrollTo(0, top);
      }

      const aligned = Math.abs(window.scrollY - top) <= 1;

      if (aligned) {
        alignedOnce = true;
      }

      return aligned;
    };

    const tick = (now: number) => {
      if (!pending) {
        return;
      }

      if (now - started > 8000) {
        stop();
        return;
      }

      const aligned = align();
      const height = root.scrollHeight;

      if (aligned && height === lastHeight) {
        if (!stableSince) {
          stableSince = now;
        }

        if (now - stableSince > 700) {
          stop();
          return;
        }
      } else {
        stableSince = 0;
        lastHeight = height;
      }

      frame = window.requestAnimationFrame(tick);
    };

    const arm = (id: string, path: string) => {
      if (!id) {
        return;
      }

      pending = { id, path };
      started = performance.now();
      stableSince = 0;
      lastHeight = -1;
      alignedOnce = false;
      // While the story is still streaming, scroll anchoring otherwise keeps
      // the footer on screen as the section is inserted above it.
      root.style.overflowAnchor = "none";
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(tick);
    };

    const armFromLocation = () => {
      const id = decodeHash(window.location.hash);

      if (!id) {
        return;
      }

      arm(id, window.location.pathname);
    };

    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      if (!(event.target instanceof Element)) {
        return;
      }

      const anchor = event.target.closest("a");

      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (anchor.target && anchor.target !== "_self") {
        return;
      }

      if (anchor.hasAttribute("download")) {
        return;
      }

      let url: URL;

      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) {
        return;
      }

      const id = decodeHash(url.hash);

      if (!id) {
        stop();
        return;
      }

      // Client navigations use pushState, which does not fire hashchange, and
      // the first history entry can omit the hash. Read it from the link.
      arm(id, url.pathname);
    };

    const onUserScroll = (event: Event) => {
      if (!pending || !alignedOnce) {
        return;
      }

      if (event instanceof KeyboardEvent) {
        const keys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "];

        if (!keys.includes(event.key)) {
          return;
        }
      }

      stop();
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", armFromLocation);
    window.addEventListener("popstate", armFromLocation);
    window.addEventListener("wheel", onUserScroll, { passive: true });
    window.addEventListener("touchmove", onUserScroll, { passive: true });
    window.addEventListener("keydown", onUserScroll);
    armFromLocation();

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", armFromLocation);
      window.removeEventListener("popstate", armFromLocation);
      window.removeEventListener("wheel", onUserScroll);
      window.removeEventListener("touchmove", onUserScroll);
      window.removeEventListener("keydown", onUserScroll);
      stop();
    };
  }, []);

  return null;
}
