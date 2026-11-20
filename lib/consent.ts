export const CONSENT_COOKIE = "gz-consent";
export const CONSENT_VERSION = 1;
/** Six months, the lifetime recommended in the cookie plan. */
export const CONSENT_MAX_AGE_SECONDS = 183 * 24 * 60 * 60;
export const GTM_ID = "GTM-5LR4972";
export const GTM_SRC = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;

export const CONSENT_VALUE_PATTERN = `^v${CONSENT_VERSION}\\.t(\\d+)\\.n1\\.s([01])\\.m([01])$`;

const CONSENT_VALUE = new RegExp(CONSENT_VALUE_PATTERN);
const GCL_COOKIE = /^_gcl/;

export type ConsentChoice = {
  v: number;
  t: number;
  necessary: true;
  statistics: boolean;
  marketing: boolean;
};

type ConsentSignals = {
  marketing: boolean;
  statistics: boolean;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function createConsent(statistics: boolean, marketing: boolean, now = Date.now()): ConsentChoice {
  return {
    v: CONSENT_VERSION,
    t: Math.floor(now / 1000),
    necessary: true,
    statistics,
    marketing,
  };
}

export function sameChoices(left: ConsentChoice, right: ConsentChoice) {
  return left.statistics === right.statistics && left.marketing === right.marketing;
}

export function serializeConsent(choice: ConsentChoice) {
  return `v${choice.v}.t${choice.t}.n1.s${choice.statistics ? 1 : 0}.m${choice.marketing ? 1 : 0}`;
}

export function parseConsent(raw: string): ConsentChoice | null {
  const match = CONSENT_VALUE.exec(raw);
  if (!match) {
    return null;
  }

  const t = Number(match[1]);
  if (!Number.isSafeInteger(t) || t < 0) {
    return null;
  }

  return {
    v: CONSENT_VERSION,
    t,
    necessary: true,
    statistics: match[2] === "1",
    marketing: match[3] === "1",
  };
}

export function readConsentFromCookieString(cookieString: string): ConsentChoice | null {
  for (const part of cookieString.split(";")) {
    const trimmed = part.trim();
    const prefix = `${CONSENT_COOKIE}=`;
    if (!trimmed.startsWith(prefix)) {
      continue;
    }

    try {
      return parseConsent(decodeURIComponent(trimmed.slice(prefix.length)));
    } catch {
      return null;
    }
  }

  return null;
}

export function consentSignals(choice: ConsentSignals) {
  const marketing = choice.marketing ? "granted" : "denied";
  const statistics = choice.statistics ? "granted" : "denied";

  return {
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
    analytics_storage: statistics,
    functionality_storage: "denied" as const,
    personalization_storage: "denied" as const,
    security_storage: "granted" as const,
  };
}

/**
 * Inline head script. It only writes `dataLayer`. It must not request Google.
 * On a later visit it reads `gz-consent` before any tag is injected.
 */
export function consentBootScript() {
  const defaults = {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
    ads_data_redaction: true,
    url_passthrough: true,
  };

  return [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){window.dataLayer.push(arguments);}",
    "window.gtag=gtag;",
    `gtag('consent','default',${JSON.stringify(defaults)});`,
    "(function(){",
    `var match=document.cookie.match(/(?:^|; )${CONSENT_COOKIE}=([^;]*)/);`,
    "if(!match)return;",
    "var value;try{value=decodeURIComponent(match[1]);}catch(e){return;}",
    `var parsed=new RegExp(${JSON.stringify(CONSENT_VALUE_PATTERN)}).exec(value);`,
    "if(!parsed)return;",
    "var statistics=parsed[2]==='1';",
    "var marketing=parsed[3]==='1';",
    "gtag('consent','update',{",
    "ad_storage:marketing?'granted':'denied',",
    "ad_user_data:marketing?'granted':'denied',",
    "ad_personalization:marketing?'granted':'denied',",
    "analytics_storage:statistics?'granted':'denied',",
    "functionality_storage:'denied',",
    "personalization_storage:'denied',",
    "security_storage:'granted'",
    "});",
    "})();",
  ].join("");
}

export function readConsentCookie() {
  return readConsentFromCookieString(document.cookie);
}

const CONSENT_CHANGE_EVENT = "gz-consent-change";

let snapshotKey: string | null = null;
let snapshotValue: ConsentChoice | "missing" | null = null;

export function subscribeConsent(onChange: () => void) {
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
}

export function consentServerSnapshot(): null {
  return null;
}

export function consentClientSnapshot(): ConsentChoice | "missing" {
  const raw = consentCookieValue(document.cookie);
  if (snapshotKey === raw && snapshotValue) {
    return snapshotValue;
  }

  snapshotKey = raw;
  snapshotValue = (raw ? readConsentFromCookieString(`${CONSENT_COOKIE}=${raw}`) : null) ?? "missing";
  return snapshotValue;
}

function consentCookieValue(cookieString: string) {
  for (const part of cookieString.split(";")) {
    const trimmed = part.trim();
    const prefix = `${CONSENT_COOKIE}=`;
    if (trimmed.startsWith(prefix)) {
      return trimmed.slice(prefix.length);
    }
  }

  return "";
}

export function writeConsentCookie(choice: ConsentChoice) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${serializeConsent(choice)}; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

export function updateConsentMode(choice: ConsentSignals) {
  const payload = consentSignals(choice);
  window.dataLayer = window.dataLayer || [];

  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", payload);
    return;
  }

  window.dataLayer.push(["consent", "update", payload]);
}

export function gclCookieNames(cookieString: string) {
  const names: string[] = [];

  for (const part of cookieString.split(";")) {
    const name = part.trim().split("=")[0];
    if (name && GCL_COOKIE.test(name)) {
      names.push(name);
    }
  }

  return names;
}

export function expireGclCookies() {
  const names = gclCookieNames(document.cookie);
  if (names.length === 0) {
    return;
  }

  const host = window.location.hostname;
  const domains: Array<string | null> = [null];
  if (host && host !== "localhost" && !/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    domains.push(host);
    const parts = host.split(".").filter(Boolean);
    if (parts.length >= 2) {
      const parent = parts.slice(-2).join(".");
      domains.push(parent, `.${parent}`);
    }
  }

  const expiry = "Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; Path=/";
  for (const name of names) {
    for (const domain of domains) {
      const domainAttribute = domain ? `; Domain=${domain}` : "";
      document.cookie = `${name}=; ${expiry}; SameSite=Lax${domainAttribute}`;
      document.cookie = `${name}=; ${expiry}; Secure; SameSite=Lax${domainAttribute}`;
    }
  }
}

let gtmInjected = false;

export function injectGoogleTagManager() {
  if (gtmInjected || document.querySelector("script[data-gz-gtm]")) {
    gtmInjected = true;
    return;
  }

  gtmInjected = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

  const script = document.createElement("script");
  script.async = true;
  script.dataset.gzGtm = "1";
  script.src = GTM_SRC;
  document.head.appendChild(script);
}

export function pushBookingOpen() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "booking_open" });
}

export function applyConsent(choice: ConsentChoice) {
  updateConsentMode(choice);
  writeConsentCookie(choice);
  if (!choice.marketing) {
    expireGclCookies();
  }
  if (choice.marketing || choice.statistics) {
    injectGoogleTagManager();
  }
}

export function storeConsentForNextLoad(choice: ConsentChoice, previous: ConsentChoice) {
  writeConsentCookie(choice);
  if ((previous.marketing && !choice.marketing) || (previous.statistics && !choice.statistics)) {
    updateConsentMode(choice);
  }
  if (!choice.marketing) {
    expireGclCookies();
  }
  window.location.reload();
}
