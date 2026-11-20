export const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid"] as const;

export type ClickIdKey = (typeof CLICK_ID_KEYS)[number];
export type ClickIds = Partial<Record<ClickIdKey, string>>;

const MAX_CLICK_ID_LENGTH = 2000;

export function clickIdsFromSearch(search: string): ClickIds {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const found: ClickIds = {};

  for (const key of CLICK_ID_KEYS) {
    const value = params.get(key);
    if (!value || value.length > MAX_CLICK_ID_LENGTH) {
      continue;
    }
    found[key] = value;
  }

  return found;
}

export function hasClickIds(ids: ClickIds | null): ids is ClickIds {
  return Boolean(ids && CLICK_ID_KEYS.some((key) => ids[key]));
}

/**
 * Same-origin destination with ad click ids kept on the query string.
 * Returns null for external, mail, and phone links. Never writes a cookie.
 */
export function internalHrefWithClickIds(href: string, base: string, ids: ClickIds | null) {
  if (!hasClickIds(ids)) {
    return null;
  }

  let current: URL;
  let url: URL;
  try {
    current = new URL(base);
    url = new URL(href, current);
  } catch {
    return null;
  }

  if (url.origin !== current.origin || (url.protocol !== "http:" && url.protocol !== "https:")) {
    return null;
  }

  for (const key of CLICK_ID_KEYS) {
    const value = ids[key];
    if (value && !url.searchParams.has(key)) {
      url.searchParams.set(key, value);
    }
  }

  return `${url.pathname}${url.search}${url.hash}`;
}
